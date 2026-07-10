import { useEffect, useMemo, useRef, useState } from 'react';
import { roadmapData } from '../data/roadmapData';
import GraduationNode from '../components/roadmap/GraduationNode';
import RoadmapPath from '../components/roadmap/RoadmapPath';
import RoadmapSummary from '../components/roadmap/RoadmapSummary';
import SemesterDetailSheet from '../components/roadmap/SemesterDetailSheet';
import SemesterNode from '../components/roadmap/SemesterNode';

const STORAGE_KEY = 'plan-h-roadmap-ssai-v1';

function loadRoadmapState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : roadmapData;
  } catch {
    return roadmapData;
  }
}

function statusLabel(status) {
  return {
    completed: '완료',
    current: '현재 학기',
    planned: '예정',
    attention: '주의 필요',
  }[status];
}

function toAppRoadmap(semesters) {
  return semesters.map((semester) => ({
    id: semester.id,
    term: semester.label,
    goal: semester.goal,
    courses: semester.courses
      .filter((course) => course.included !== false)
      .map((course) => ({
        id: course.id,
        name: course.name,
        credits: course.credits,
        type: course.category,
        required: course.required,
      })),
    reason: semester.aiReason,
  }));
}

function currentOrder(user) {
  const grade = Number(String(user?.grade || '2학년').replace(/[^0-9]/g, '')) || 2;
  const semester = String(user?.semester || '1학기').includes('2') ? 2 : 1;
  return Math.min(Math.max((grade - 1) * 2 + semester, 1), 8);
}

function applyUserStatus(semesters, user) {
  const order = currentOrder(user);
  return semesters.map((semester) => ({
    ...semester,
    status: semester.order < order ? 'completed' : semester.order === order ? 'current' : semester.status === 'attention' ? 'attention' : 'planned',
  }));
}

export default function Roadmap({ setRoadmap, metrics, user, completedCourses, setCompletedCourses }) {
  const [semesters, setSemesters] = useState(() => applyUserStatus(loadRoadmapState(), user));
  const [selectedId, setSelectedId] = useState(null);
  const topRef = useRef(null);
  const currentRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
    setRoadmap(toAppRoadmap(semesters));
  }, [semesters]);

  useEffect(() => {
    const timer = window.setTimeout(() => currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedSemester = semesters.find((semester) => semester.id === selectedId);
  const actualCredits = useMemo(() => {
    const completedPast = semesters
      .filter((semester) => semester.status === 'completed')
      .reduce((sum, semester) => sum + semester.completedCredits, 0);
    const activeCompleted = semesters
      .filter((semester) => semester.status !== 'completed')
      .flatMap((semester) => semester.courses)
      .filter((course) => course.included !== false && course.completed)
      .reduce((sum, course) => sum + course.credits, 0);
    return completedPast + activeCompleted;
  }, [semesters]);
  const completedCount = semesters.filter((semester) => semester.status === 'completed').length;
  const lastRequiredMissing = semesters
    .find((semester) => semester.id === 'year4-semester2')
    ?.courses.some((course) => course.required && course.included === false);
  const graduationReady = !lastRequiredMissing && actualCredits + 26 >= metrics.totalRequired;

  const updateCourse = (semesterId, courseId, changes) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              courses: semester.courses.map((course) => (course.id === courseId ? { ...course, ...changes } : course)),
            }
          : semester,
      ),
    );
    if (changes.completed !== undefined) {
      const courseMap = {
        'ssai-302': 'need01',
        'ssai-303': 'need02',
      };
      const linkedId = courseMap[courseId];
      if (linkedId && completedCourses && setCompletedCourses) {
        setCompletedCourses(completedCourses.map((course) => (course.id === linkedId ? { ...course, completed: changes.completed } : course)));
      }
    }
  };

  const addCourse = (semesterId, course) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId && !semester.courses.some((item) => item.name === course.name)
          ? { ...semester, courses: [...semester.courses, course] }
          : semester,
      ),
    );
  };

  const removeCourse = (semesterId, courseId) => {
    setSemesters((current) =>
      current.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              status: semester.courses.find((course) => course.id === courseId)?.required ? 'attention' : semester.status,
              courses: semester.courses.filter((course) => course.id !== courseId),
            }
          : semester,
      ),
    );
  };

  const moveCourse = (fromSemesterId, courseId, toSemesterId) => {
    if (fromSemesterId === toSemesterId) return;
    setSemesters((current) => {
      const source = current.find((semester) => semester.id === fromSemesterId);
      const moving = source?.courses.find((course) => course.id === courseId);
      if (!moving) return current;
      return current.map((semester) => {
        if (semester.id === fromSemesterId) {
          return { ...semester, courses: semester.courses.filter((course) => course.id !== courseId) };
        }
        if (semester.id === toSemesterId && !semester.courses.some((course) => course.id === courseId)) {
          return { ...semester, courses: [...semester.courses, moving] };
        }
        return semester;
      });
    });
  };

  const scrollToCurrent = () => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setSelectedId('year4-semester1');
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="roadmapPage" ref={topRef}>
      <RoadmapSummary
        currentLabel={`${user.grade} ${user.semester}`}
        actualCredits={actualCredits}
        totalCredits={metrics.totalRequired}
        remainingCredits={Math.max(metrics.totalRequired - actualCredits, 0)}
        completedCount={completedCount}
        onShowAll={scrollToTop}
        onShowCurrent={scrollToCurrent}
      />

      <section className="roadmapJourney" aria-label="입학부터 졸업까지 학업 로드맵">
        <div className="yearMist yearOne">1학년</div>
        <div className="yearMist yearTwo">2학년</div>
        <div className="yearMist yearThree">3학년</div>
        <div className="yearMist yearFour">4학년</div>
        <RoadmapPath semesters={semesters} />
        <span className="roadLabel start">입학</span>
        {semesters.map((semester) => (
          <SemesterNode
            key={semester.id}
            semester={semester}
            isSelected={selectedId === semester.id}
            statusLabel={statusLabel(semester.status)}
            onClick={() => setSelectedId(semester.id)}
            nodeRef={semester.status === 'current' ? currentRef : undefined}
          />
        ))}
        <GraduationNode ready={graduationReady} />
      </section>

      {selectedSemester && (
        <SemesterDetailSheet
          semester={selectedSemester}
          statusLabel={statusLabel(selectedSemester.status)}
          metrics={metrics}
          actualCredits={actualCredits}
          graduationReady={graduationReady}
          onClose={() => setSelectedId(null)}
          onToggleComplete={(courseId, completed) => updateCourse(selectedSemester.id, courseId, { completed })}
          onToggleIncluded={(courseId, included) => updateCourse(selectedSemester.id, courseId, { included })}
          semesters={semesters}
          onAddCourse={addCourse}
          onRemoveCourse={removeCourse}
          onMoveCourse={moveCourse}
        />
      )}
    </div>
  );
}
