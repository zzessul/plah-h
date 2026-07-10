import Button from '../components/Button';
import { demoUser } from '../data/mockData';
import { useState } from 'react';

const fields = [
  ['name', '이름'],
  ['studentId', '학번'],
  ['admissionYear', '입학년도'],
  ['grade', '현재 학년'],
  ['semester', '현재 학기'],
  ['primaryMajor', '제1전공'],
  ['secondMajor', '제2전공 또는 부전공'],
  ['earnedCredits', '현재 이수 학점'],
  ['totalCredits', '졸업 필요 학점'],
  ['exchange', '교환학생 경험 여부'],
  ['interests', '관심 분야'],
  ['preferredTime', '선호 수업 시간'],
  ['freeDay', '공강 선호 요일'],
  ['teamwork', '팀플 선호도'],
  ['onlinePreference', '온라인 강의 선호도'],
];

export default function Onboarding({ user, setUser, onStart }) {
  const [error, setError] = useState('');
  const update = (key, value) => setUser({ ...user, [key]: value });
  const start = () => {
    const earned = Number(user.earnedCredits || 108);
    const total = Number(user.totalCredits || 134);
    if (!user.name?.trim()) return setError('이름을 입력해야 시작할 수 있어요.');
    if (earned > total) return setError('현재 이수 학점은 졸업 필요 학점보다 클 수 없어요.');
    if (user.primaryMajor && user.primaryMajor === user.secondMajor) return setError('제1전공과 제2전공은 서로 다르게 입력해주세요.');
    if (!['1학년', '2학년', '3학년', '4학년'].includes(user.grade)) return setError('현재 학년은 1학년부터 4학년 중 하나로 입력해주세요.');
    if (!['1학기', '2학기', '여름학기', '겨울학기'].includes(user.semester)) return setError('현재 학기는 1학기, 2학기, 여름학기, 겨울학기 중 하나로 입력해주세요.');
    setError('');
    onStart();
  };

  return (
    <main className="phoneFrame onboardingFrame">
      <div className="onboardingHero">
        <p>AI 학업 에이전트</p>
        <h1>Plan H</h1>
        <span>Plan A가 막혀도 졸업까지의 다음 선택지를 준비해요.</span>
      </div>
      <section className="onboardingForm">
        {fields.map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <input value={user[key] || ''} onChange={(event) => update(key, event.target.value)} />
          </label>
        ))}
      </section>
      {error && <p className="formError">{error}</p>}
      <div className="stickyActions">
        <Button variant="secondary" onClick={() => { setError(''); setUser({ ...demoUser, earnedCredits: 108, totalCredits: 134 }); onStart(); }}>
          데모 정보로 시작하기
        </Button>
        <Button onClick={start}>홈 화면으로 이동</Button>
      </div>
    </main>
  );
}
