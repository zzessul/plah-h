import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { demoUser } from '../data/mockData';

const textFields = [
  ['name', '이름', '예: 홍길동'],
  ['earnedCredits', '현재 이수 학점', '예: 52'],
];

const selectFields = [
  ['studentId', '학번', ['2019학번', '2020학번', '2021학번', '2022학번', '2023학번', '2024학번', '2025학번', '2026학번']],
  ['admissionYear', '입학년도', ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026']],
  ['grade', '현재 학년', ['1학년', '2학년', '3학년', '4학년']],
  ['semester', '현재 학기', ['1학기', '2학기', '여름학기', '겨울학기']],
  ['primaryMajor', '제1전공', ['Social Science & AI융합학부']],
  ['secondMajor', '이수 유형', ['전공심화(단일전공)', '전공심화 + 부전공', 'SSAI 이중전공', 'SSAI 부전공']],
  ['exchange', '교환학생 경험 여부', ['없음', '예정', '다녀옴', '학점인정 확인 필요']],
  ['preferredTime', '선호 수업 시간', ['오전 수업', '오후 수업', '저녁 수업', '상관없음']],
  ['freeDay', '공강 선호 요일', ['월요일', '화요일', '수요일', '목요일', '금요일', '상관없음']],
  ['teamwork', '팀플 선호도', ['낮음', '보통', '높음']],
  ['onlinePreference', '온라인 강의 선호도', ['낮음', '보통', '높음']],
];

const completionTypeMap = {
  '전공심화(단일전공)': 'single-major',
  '전공심화 + 부전공': 'major-with-minor',
  'SSAI 이중전공': 'double-major',
  'SSAI 부전공': 'minor',
};

const interestKeywords = [
  '사회과학 데이터 분석',
  '정책 AI',
  '자연어 처리',
  '사회연결망 분석',
  '빅데이터 시각화',
  '미디어 데이터',
  '비즈니스 데이터',
  'GIS/공간 데이터',
  'AI 윤리',
  '헬스 애널리틱스',
];

function splitInterests(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function Onboarding({ user, onStart }) {
  const [profile, setProfile] = useState({ ...demoUser, ...user });
  const [otherInterest, setOtherInterest] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const selectedInterests = splitInterests(profile.interests);

  useEffect(() => {
    setProfile({ ...demoUser, ...user });
  }, [user]);

  const update = (key, value) => {
    setSaved(false);
    setProfile((current) => ({
      ...current,
      [key]: value,
      ...(key === 'admissionYear' ? { studentId: `${value}학번` } : {}),
      ...(key === 'secondMajor' ? { completionType: completionTypeMap[value] || current.completionType } : {}),
    }));
  };

  const toggleInterest = (keyword) => {
    setSaved(false);
    const next = selectedInterests.includes(keyword)
      ? selectedInterests.filter((item) => item !== keyword)
      : [...selectedInterests, keyword];
    setProfile((current) => ({ ...current, interests: next.join(', ') }));
  };

  const addOtherInterest = () => {
    const value = otherInterest.trim();
    if (!value || selectedInterests.includes(value)) return;
    setProfile((current) => ({ ...current, interests: [...selectedInterests, value].join(', ') }));
    setOtherInterest('');
    setSaved(false);
  };

  const start = () => {
    const earned = Number(profile.earnedCredits || 0);
    const total = Number(profile.totalCredits || 134);
    if (!profile.name?.trim()) return setError('이름을 입력해야 시작할 수 있어요.');
    if (!profile.studentId?.trim()) return setError('학번을 입력해야 저장할 수 있어요.');
    if (earned > total) return setError('현재 이수 학점은 졸업 필요 학점보다 클 수 없어요.');
    if (!['1학년', '2학년', '3학년', '4학년'].includes(profile.grade)) return setError('현재 학년을 선택해주세요.');
    if (!['1학기', '2학기', '여름학기', '겨울학기'].includes(profile.semester)) return setError('현재 학기를 선택해주세요.');
    setError('');
    setSaved(true);
    onStart({ ...profile, earnedCredits: earned, totalCredits: total });
  };

  return (
    <main className="phoneFrame onboardingFrame">
      <div className="onboardingHero">
        <p>AI 학업 에이전트</p>
        <h1>Plan H</h1>
        <span>SSAI 학생의 실제 입력값에 맞춰 로드맵과 시간표를 추천해요.</span>
      </div>
      <section className="onboardingForm">
        {textFields.map(([key, label, placeholder]) => (
          <label key={key}>
            <span>{label}</span>
            <input
              type={key === 'earnedCredits' ? 'number' : 'text'}
              value={profile[key] ?? ''}
              placeholder={placeholder}
              onChange={(event) => update(key, event.target.value)}
            />
          </label>
        ))}
        {selectFields.map(([key, label, options]) => (
          <label key={key}>
            <span>{label}</span>
            <select value={profile[key] || options[0]} onChange={(event) => update(key, event.target.value)}>
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        ))}
        <div className="interestPicker">
          <span>관심 분야</span>
          <div className="interestGrid">
            {interestKeywords.map((keyword) => (
              <button
                type="button"
                key={keyword}
                className={selectedInterests.includes(keyword) ? 'selected' : ''}
                onClick={() => toggleInterest(keyword)}
              >
                {keyword}
              </button>
            ))}
          </div>
          <div className="otherInterest">
            <input
              value={otherInterest}
              placeholder="기타 관심 분야 입력"
              onChange={(event) => setOtherInterest(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && addOtherInterest()}
            />
            <button type="button" onClick={addOtherInterest}>추가</button>
          </div>
          {selectedInterests.length > 0 && <small>선택됨: {selectedInterests.join(', ')}</small>}
        </div>
      </section>
      {error && <p className="formError">{error}</p>}
      {saved && <p className="formSuccess">사용자 정보가 저장되었습니다.</p>}
      <div className="stickyActions">
        <Button onClick={start}>프로필 설정 완료</Button>
      </div>
    </main>
  );
}
