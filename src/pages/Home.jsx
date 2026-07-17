import { ArrowRight, BookOpenCheck, CalendarDays, ChevronRight, Clock3, GraduationCap, Sparkles, TriangleAlert } from 'lucide-react';
import Card from '../components/Card';
import planiMascot from '../assets/plani-mascot.png';

export default function Home({ user, metrics, completedCourses, setActiveTab, events = [] }) {
  const displayName = user.name?.trim() || 'SSAI 학생';
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
  const upcoming = [...events].filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0]
    || [...events].sort((a, b) => b.date.localeCompare(a.date))[0];
  const requiredArea = metrics.areas.find((area) => area.key === 'requiredCourses');
  const completedRequired = requiredArea?.earned || 0;
  const requiredTotal = requiredArea?.required || completedCourses.filter((course) => course.required).length;
  const plannedCourses = 6;

  return (
    <div className="pageStack homePage">
      <section className="homeGreeting">
        <div><p>안녕하세요,</p><h2>{displayName}님!</h2><span>{user.grade} {user.semester} · SSAI</span></div>
        <img src={planiMascot} alt="AI 학업 도우미 플래니" />
      </section>

      <Card className="graduationHero" onClick={() => setActiveTab('detail')}>
        <div className="heroTop"><div><p className="eyebrow">졸업 준비 현황</p><h2>졸업까지 <strong>{metrics.remainingCredits}학점</strong> 남았어요</h2></div><span>{metrics.progress}%</span></div>
        <div className="largeProgress" aria-label={`졸업 진행률 ${metrics.progress}%`}><span style={{ width: `${metrics.progress}%` }} /></div>
        <div className="heroBottom"><span>{metrics.earnedCredits} / {metrics.totalRequired}학점</span><button>상세 보기 <ChevronRight size={15} /></button></div>
      </Card>

      <section>
        <div className="sectionHeader"><h3>이번 학기 요약</h3><button onClick={() => setActiveTab('roadmap')}>계획 보기</button></div>
        <Card className="semesterSummary">
          <div><span className="summaryMiniIcon blue"><GraduationCap size={18} /></span><small>신청 학점</small><strong>18학점</strong></div>
          <div><span className="summaryMiniIcon sky"><BookOpenCheck size={18} /></span><small>수강 과목</small><strong>{plannedCourses}과목</strong></div>
          <div><span className="summaryMiniIcon gold"><Clock3 size={18} /></span><small>현재 학기</small><strong>{user.grade} {user.semester}</strong></div>
          <div><span className="summaryMiniIcon green"><Sparkles size={18} /></span><small>전공필수</small><strong>{completedRequired}/{requiredTotal} 완료</strong></div>
        </Card>
      </section>

      <Card className="planiMessageCard">
        <img src={planiMascot} alt="플래니" />
        <div><span>오늘의 플래니 한마디</span><p>오늘도 무리하지 말고, 작은 계획부터 하나씩 완료해봐요.</p></div>
      </Card>

      <section className="quickGrid">
        <button className="quickCard" onClick={() => setActiveTab('calendar')}><span><CalendarDays size={19} /></span><div><small>다음 일정</small><strong>{upcoming ? upcoming.title : '일정을 추가해보세요'}</strong><p>{upcoming?.date || '캘린더에서 관리'}</p></div><ChevronRight size={17} /></button>
        <button className="quickCard" onClick={() => setActiveTab('recommendations')}><span><Sparkles size={19} /></span><div><small>맞춤 추천</small><strong>다음 학기 과목</strong><p>공식 권장 학기 기반</p></div><ArrowRight size={17} /></button>
      </section>

      <Card className="warningStrip" onClick={() => setActiveTab('detail')}>
        <span><TriangleAlert size={18} /></span><div><strong>졸업요건 확인이 필요해요</strong><p>전공필수와 외국어 인증 상태를 점검해주세요.</p></div><ChevronRight size={18} />
      </Card>
    </div>
  );
}
