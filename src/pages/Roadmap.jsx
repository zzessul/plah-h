import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { termCredits } from '../utils/graduation';

export default function Roadmap({ roadmap, setRoadmap, metrics }) {
  const [reason, setReason] = useState(null);
  const [newCourse, setNewCourse] = useState('');

  const removeCourse = (termId, courseId) => {
    setRoadmap(roadmap.map((term) => (term.id === termId ? { ...term, courses: term.courses.filter((course) => course.id !== courseId) } : term)));
  };

  const moveCourse = (fromIndex, courseId, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= roadmap.length) return;
    const draft = roadmap.map((term) => ({ ...term, courses: [...term.courses] }));
    const courseIndex = draft[fromIndex].courses.findIndex((course) => course.id === courseId);
    const [course] = draft[fromIndex].courses.splice(courseIndex, 1);
    draft[toIndex].courses.push(course);
    setRoadmap(draft);
  };

  const addCourse = () => {
    if (!newCourse.trim()) return;
    setRoadmap(roadmap.map((term, index) => index === 0 ? {
      ...term,
      courses: [...term.courses, { id: `custom-${Date.now()}`, name: newCourse, credits: 3, type: '직접 추가', required: false }],
    } : term));
    setNewCourse('');
  };

  let cumulative = 108;

  return (
    <div className="pageStack">
      <Card className="roadmapControl">
        <h3>과목 추가</h3>
        <div className="inlineInput">
          <input value={newCourse} onChange={(event) => setNewCourse(event.target.value)} placeholder="예: 일본경제세미나" />
          <button className="iconButton filled" onClick={addCourse} aria-label="과목 추가"><Plus size={18} /></button>
        </div>
        <p className={metrics.canGraduateWithPlan ? 'okText' : 'warnText'}>
          현재 로드맵 기준: {metrics.canGraduateWithPlan ? '졸업 가능' : '졸업요건 확인 필요'}
        </p>
      </Card>

      <div className="timeline">
        {roadmap.map((term, termIndex) => {
          cumulative += termCredits(term);
          return (
            <Card className="termCard" key={term.id}>
              <div className="termHeader">
                <div>
                  <p className="eyebrow">{term.goal}</p>
                  <h3>{term.term}</h3>
                </div>
                <strong>{termCredits(term)}학점</strong>
              </div>
              <div className="courseChips">
                {term.courses.map((course) => (
                  <div className="roadCourse" key={course.id}>
                    <div>
                      <strong>{course.name}</strong>
                      <span>{course.type} · {course.credits}학점</span>
                    </div>
                    <div className="courseActions">
                      <button onClick={() => moveCourse(termIndex, course.id, -1)} aria-label="이전 학기로 이동"><ArrowUp size={15} /></button>
                      <button onClick={() => moveCourse(termIndex, course.id, 1)} aria-label="다음 학기로 이동"><ArrowDown size={15} /></button>
                      <button onClick={() => removeCourse(term.id, course.id)} aria-label="삭제"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="termFooter">
                <span>예상 누적 {cumulative}학점</span>
                <span>{cumulative >= 134 ? '졸업학점 충족' : '진행 중'}</span>
              </div>
              <Button variant="ghost" onClick={() => setReason(term)}>AI가 추천한 이유</Button>
            </Card>
          );
        })}
      </div>

      {reason && (
        <Modal title="AI 추천 근거" onClose={() => setReason(null)}>
          <p>{reason.reason}</p>
          <ul className="reasonList">
            <li>전공필수 과목이므로 졸업 전에 이수해야 합니다.</li>
            <li>선수과목 이수 조건을 충족했습니다.</li>
            <li>다음 학기에는 개설되지 않을 가능성이 있습니다.</li>
            <li>관심 분야인 데이터 분석과 관련된 과목입니다.</li>
          </ul>
        </Modal>
      )}
    </div>
  );
}
