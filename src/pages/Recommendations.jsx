import { BookOpen, Check, Clock3, Plus, Search, Sparkles, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { roadmapData } from '../data/ssai/officialAppData';

const filters = ['전체', '전공필수', '전공선택', '관심 분야'];

export default function Recommendations({ user, plans, setPlans, setActivePlan, setActiveTab }) {
  const [filter, setFilter] = useState('전체');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [added, setAdded] = useState([]);
  const interests = String(user.interests || '').split(',').map((item) => item.trim()).filter(Boolean);
  const current = Math.min(Math.max((Number(String(user.grade).replace(/\D/g, '')) - 1) * 2 + (String(user.semester).includes('2') ? 2 : 1), 1), 8);
  const candidates = useMemo(() => {
    const terms = roadmapData.filter((term) => term.order >= current).slice(0, 3);
    const unique = new Map();
    terms.flatMap((term) => term.courses).forEach((course) => unique.set(course.id, course));
    return [...unique.values()];
  }, [current]);
  const visible = candidates.filter((course) => {
    const matchesQuery = !query.trim() || course.name.includes(query.trim()) || String(course.category || '').includes(query.trim());
    if (!matchesQuery) return false;
    if (filter === '전공필수') return course.required;
    if (filter === '전공선택') return !course.required;
    if (filter === '관심 분야') return interests.some((interest) => course.name.includes(interest.split(' ')[0]));
    return true;
  });

  const addToPlan = (course) => {
    if (added.includes(course.id)) return;
    setPlans({ ...plans, A: { ...plans.A, courses: [...plans.A.courses, { ...course, day: null, start: null, end: null, room: '시간 미정', status: '검증 필요' }] } });
    setAdded([...added, course.id]);
  };

  const openPlan = () => {
    setActivePlan('A');
    setActiveTab('timetable');
  };

  return (
    <div className="pageStack recommendationsPage">
      <section className="pageIntro">
        <div><p className="eyebrow">맞춤 추천</p><h2>{user.name || 'SSAI 학생'}님을 위한 다음 과목</h2><p>공식 교육과정의 권장 학기와 전공필수 여부를 우선 반영했어요.</p></div>
        <button className="iconButton" onClick={() => setSearchOpen((value) => !value)} aria-label="추천 과목 검색"><Search size={19} /></button>
      </section>
      {searchOpen && <input className="searchInput" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="과목명이나 영역으로 검색" autoFocus />}
      <div className="filterChips" aria-label="추천 과목 필터">
        {filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      {visible.length ? visible.map((course, index) => (
        <Card className="recommendCard" key={course.id}>
          <div className="courseIcon"><BookOpen size={20} /></div>
          <div className="recommendBody">
            <div className="recommendTitle"><div><span>{course.required ? '전공필수' : '전공선택'} · {course.credits}학점</span><h3>{course.name}</h3></div><strong><Star size={14} fill="currentColor" /> {(4.9 - index * .1).toFixed(1)}</strong></div>
            <p>{course.reason || 'SSAI 공식 교육과정에 포함된 과목입니다.'}</p>
            <div className="tagRow"><span>{course.required ? '필수' : '권장'}</span><span><Clock3 size={12} /> 공식 시간 확인 필요</span></div>
            <button className={added.includes(course.id) ? 'courseAddButton added' : 'courseAddButton'} onClick={() => addToPlan(course)}>
              {added.includes(course.id) ? <><Check size={16} /> Plan A에 추가됨</> : <><Plus size={16} /> 시간표 후보에 추가</>}
            </button>
          </div>
        </Card>
      )) : <Card className="emptyState"><Sparkles size={24} /><strong>이 조건의 추천 과목이 아직 없어요</strong><span>전체 필터에서 공식 교육과정 과목을 확인해보세요.</span></Card>}
      <Button onClick={openPlan}>나의 시간표에서 확인하기</Button>
    </div>
  );
}
