import { BookOpenCheck, Check, ChevronRight, CircleAlert, Languages, LibraryBig, Medal, School, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/Card';
import planiMascot from '../assets/plani-mascot.png';

const icons = { primaryMajor: School, secondMajor: LibraryBig, liberalArts: BookOpenCheck, requiredCourses: Medal, certification: Languages };

export default function GraduationDetail({ metrics }) {
  const [view, setView] = useState('all');
  const areas = view === 'all' ? metrics.areas : metrics.areas.filter((area) => area.earned < area.required);
  return (
    <div className="pageStack graduationPage">
      <div className="segmented two"><button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>전체 요건</button><button className={view === 'detail' ? 'active' : ''} onClick={() => setView('detail')}>미충족 내역</button></div>
      <Card className="graduationSummary">
        <div><p className="eyebrow">전체 이수 현황</p><h2>{metrics.earnedCredits} / {metrics.totalRequired}학점</h2><span>{metrics.remainingCredits}학점 남음</span></div>
        <div className="summaryRing" style={{ '--progress': `${metrics.progress * 3.6}deg` }}><strong>{metrics.progress}%</strong></div>
      </Card>
      <div className="graduationList">
        {areas.map((area) => {
          const Icon = icons[area.key] || CircleAlert;
          const progress = area.required ? Math.min(area.earned / area.required * 100, 100) : 100;
          const done = area.earned >= area.required;
          return <Card key={area.key} className="graduationRow"><span className={done ? 'requirementIcon done' : 'requirementIcon'}><Icon size={19} /></span><div><div className="requirementTitle"><strong>{area.label}</strong><span>{area.earned} / {area.required}{area.key === 'requiredCourses' ? '개' : area.key === 'certification' ? '건' : '학점'}</span></div><div className="miniProgress"><span className={done ? 'done' : ''} style={{ width: `${progress}%` }} /></div><small>{done ? '요건을 충족했어요' : `${Math.max(area.required - area.earned, 0)}${area.key === 'requiredCourses' ? '개' : '학점'} 더 필요해요`}</small></div>{done ? <Check className="doneCheck" size={18} /> : <ChevronRight size={18} />}</Card>;
        })}
      </div>
      <Card className="planiGraduation"><img src={planiMascot} alt="졸업요건을 안내하는 플래니" /><div><span><Sparkles size={14} /> 플래니의 체크</span><strong>전공필수 과목과 외국어 인증 상태를 확인해주세요.</strong><p>불확실한 값은 학교 공식 시스템에서 최종 확인이 필요해요.</p></div></Card>
    </div>
  );
}
