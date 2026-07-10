import Button from '../components/Button';
import { demoUser } from '../data/mockData';

const fields = [
  ['name', '이름'],
  ['studentId', '학번'],
  ['admissionYear', '입학년도'],
  ['grade', '현재 학년'],
  ['semester', '현재 학기'],
  ['primaryMajor', '제1전공'],
  ['secondMajor', '제2전공 또는 부전공'],
  ['exchange', '교환학생 경험 여부'],
  ['interests', '관심 분야'],
  ['preferredTime', '선호 수업 시간'],
  ['freeDay', '공강 선호 요일'],
  ['teamwork', '팀플 선호도'],
  ['onlinePreference', '온라인 강의 선호도'],
];

export default function Onboarding({ user, setUser, onStart }) {
  const update = (key, value) => setUser({ ...user, [key]: value });

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
      <div className="stickyActions">
        <Button variant="secondary" onClick={() => setUser(demoUser)}>
          데모 정보로 시작하기
        </Button>
        <Button onClick={onStart}>홈 화면으로 이동</Button>
      </div>
    </main>
  );
}
