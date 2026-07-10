import { ChevronDown, ChevronRight, TriangleAlert, UserRound } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Home({ user, metrics, completedCourses, setCompletedCourses, setActiveTab, events = [] }) {
  const [openKey, setOpenKey] = useState('primaryMajor');

  const toggleCourse = (id) => {
    setCompletedCourses(completedCourses.map((course) => (course.id === id ? { ...course, completed: !course.completed } : course)));
  };

  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="pageStack">
      <section className="homeHero">
        <div>
          <p>{user.grade} {user.semester}</p>
          <h2>{user.name.slice(1)}님, 졸업까지 {metrics.remainingCredits}학점 남았어요</h2>
        </div>
        <button className="avatar" onClick={() => setActiveTab('detail')} aria-label="프로필 및 졸업요건 확인">
          <UserRound size={24} />
        </button>
      </section>

      <Card className="progressCard" onClick={() => setActiveTab('detail')}>
        <div className="progressRing" style={{ '--progress': `${metrics.progress}%` }}>
          <strong>{metrics.progress}%</strong>
          <span>졸업 준비도</span>
        </div>
        <div>
          <p className="eyebrow">현재 이수 학점</p>
          <h3>{metrics.earnedCredits} / {metrics.totalRequired}학점</h3>
          <span className={`statusPill ${metrics.status === '예상 졸업 가능' ? 'ok' : 'warn'}`}>{metrics.status}</span>
        </div>
      </Card>

      <section className="sectionHeader">
        <h3>영역별 졸업요건</h3>
        <button onClick={() => setActiveTab('detail')}>상세 보기</button>
      </section>
      {metrics.areas.map((area) => (
        <Card key={area.key} className="requirementCard">
          <button className="requirementTop" onClick={() => setOpenKey(openKey === area.key ? '' : area.key)}>
            <span>{openKey === area.key ? <ChevronDown size={18} /> : <ChevronRight size={18} />}{area.label}</span>
            <strong>{area.earned} / {area.required}{area.key === 'requiredCourses' ? '개' : '학점'}</strong>
          </button>
          <div className="miniProgress"><span style={{ width: `${Math.min((area.earned / area.required) * 100, 100)}%` }} /></div>
          {openKey === area.key && (
            <div className="courseList">
              {completedCourses
                .filter((course) => course.area === area.label || area.label === '필수 교과목')
                .slice(0, 4)
                .map((course) => (
                  <label className="courseToggle" key={course.id}>
                    <input type="checkbox" checked={course.completed} onChange={() => toggleCourse(course.id)} />
                    <span>{course.name}</span>
                    <small>{course.credits}학점</small>
                  </label>
                ))}
            </div>
          )}
        </Card>
      ))}

      <Card className="alertCard">
        <h3><TriangleAlert size={18} /> 이번 학기 주의</h3>
        <p>전공필수 1과목 미이수</p>
        <p>제2전공 10학점 부족</p>
        <p>졸업인증 확인 필요</p>
        <Button onClick={() => setActiveTab('roadmap')}>이번 학기 추천 계획 보기</Button>
      </Card>

      <Card>
        <h3>다음 일정</h3>
        <div className="eventList">
          {upcoming.map((item) => (
            <button className="eventButton" key={item.id || item.title} onClick={() => setActiveTab('calendar')}>
              {item.date?.slice(5).replace('-', '월 ')}일 · {item.title || item}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
