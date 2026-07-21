import { ArrowLeft, ArrowRight, Check, GraduationCap, Sparkles, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { demoUser } from '../data/ssai/officialAppData';
import planiMascot from '../assets/plani-mascot.png';

const basicFields = [
  { key: 'name', label: '이름', type: 'text', placeholder: '이름을 입력해주세요' },
  { key: 'studentId', label: '학번(입학년도)', options: ['2019학번', '2020학번', '2021학번', '2022학번', '2023학번', '2024학번', '2025학번', '2026학번'] },
  { key: 'grade', label: '현재 학년', options: ['1학년', '2학년', '3학년', '4학년'] },
  { key: 'semester', label: '현재 학기', options: ['1학기', '2학기', '여름학기', '겨울학기'] },
];

const academicFields = [
  { key: 'primaryMajor', label: '제1전공', options: ['Social Science & AI융합학부'] },
  { key: 'secondMajor', label: '이수 유형', options: ['전공심화(단일전공)', '전공심화 + 부전공', 'SSAI 이중전공', 'SSAI 부전공'] },
  { key: 'earnedCredits', label: '현재 이수 학점', type: 'number', placeholder: '예: 52' },
  { key: 'majorCompletedCredits', label: 'SSAI 전공 이수학점', type: 'number', placeholder: '예: 24' },
  { key: 'generalEducationCompletedCredits', label: '교양 이수학점', type: 'number', placeholder: '예: 26' },
  { key: 'requiredCourseCount', label: '전공필수 이수 과목 수', type: 'number', placeholder: '예: 4' },
  { key: 'languageCertification', label: '외국어인증', options: ['미완료', '완료', '면제/대체 예정'] },
  { key: 'exchange', label: '교환학생 경험', options: ['없음', '예정', '다녀옴', '학점인정 확인 필요'] },
];

const preferenceFields = [
  { key: 'preferredTime', label: '선호 수업 시간', options: ['오전 수업', '오후 수업', '저녁 수업', '상관없음'] },
  { key: 'freeDay', label: '공강 선호 요일', options: ['월요일', '화요일', '수요일', '목요일', '금요일', '상관없음'] },
  { key: 'teamwork', label: '팀플 선호도', options: ['낮음', '보통', '높음'] },
  { key: 'onlinePreference', label: '온라인 강의 선호도', options: ['낮음', '보통', '높음'] },
];

const completionTypeMap = {
  '전공심화(단일전공)': 'single-major',
  '전공심화 + 부전공': 'major-with-minor',
  'SSAI 이중전공': 'double-major',
  'SSAI 부전공': 'minor',
};

const interestKeywords = ['사회과학 데이터 분석', '정책 AI', '자연어 처리', '사회연결망 분석', '빅데이터 시각화', '미디어 데이터', '비즈니스 데이터', 'GIS/공간 데이터', 'AI 윤리', '헬스 애널리틱스'];
const steps = [
  { label: '기본 정보', title: '먼저 학교 정보를 알려주세요', description: '학년과 학기를 기준으로 맞춤 로드맵을 만들어요.', icon: UserRound },
  { label: '학업 정보', title: '현재 이수 현황을 확인할게요', description: '입학연도별 졸업요건과 남은 학점을 계산해요.', icon: GraduationCap },
  { label: '맞춤 설정', title: '마지막으로 수업 취향을 알려주세요', description: '관심 분야와 선호 조건을 과목 추천에 반영해요.', icon: Sparkles },
];

function splitInterests(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function Field({ field, value, onChange }) {
  return (
    <label className="profileField">
      <span>{field.label}</span>
      {field.options ? (
        <select value={value || field.options[0]} onChange={(event) => onChange(field.key, event.target.value)}>
          {field.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : (
        <input type={field.type} value={value ?? ''} placeholder={field.placeholder} onChange={(event) => onChange(field.key, event.target.value)} />
      )}
    </label>
  );
}

export default function Onboarding({ user, onStart }) {
  const [profile, setProfile] = useState({ ...demoUser, ...user });
  const [step, setStep] = useState(0);
  const [otherInterest, setOtherInterest] = useState('');
  const [error, setError] = useState('');
  const selectedInterests = splitInterests(profile.interests);
  const StepIcon = steps[step].icon;

  useEffect(() => setProfile({ ...demoUser, ...user }), [user]);

  const update = (key, value) => {
    setError('');
    setProfile((current) => ({
      ...current,
      [key]: value,
      ...(key === 'studentId' ? { admissionYear: String(value).replace(/[^0-9]/g, '') } : {}),
      ...(key === 'secondMajor' ? { completionType: completionTypeMap[value] || current.completionType } : {}),
    }));
  };

  const toggleInterest = (keyword) => {
    const next = selectedInterests.includes(keyword) ? selectedInterests.filter((item) => item !== keyword) : [...selectedInterests, keyword];
    update('interests', next.join(', '));
  };

  const addOtherInterest = () => {
    const value = otherInterest.trim();
    if (!value || selectedInterests.includes(value)) return;
    update('interests', [...selectedInterests, value].join(', '));
    setOtherInterest('');
  };

  const validateStep = () => {
    if (step === 0 && !profile.name?.trim()) return '이름을 입력해주세요.';
    if (step === 1 && Number(profile.earnedCredits || 0) > Number(profile.totalCredits || 134)) return '현재 이수 학점은 졸업 필요 학점보다 클 수 없어요.';
    return '';
  };

  const next = () => {
    const message = validateStep();
    if (message) return setError(message);
    setError('');
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const finish = () => {
    const earned = Number(profile.earnedCredits || 0);
    if (!profile.name?.trim()) { setStep(0); return setError('이름을 입력해주세요.'); }
    if (earned > Number(profile.totalCredits || 134)) { setStep(1); return setError('현재 이수 학점을 다시 확인해주세요.'); }
    onStart({
      ...profile,
      earnedCredits: earned,
      majorCompletedCredits: Number(profile.majorCompletedCredits || 0),
      generalEducationCompletedCredits: Number(profile.generalEducationCompletedCredits || 0),
      requiredCourseCount: Number(profile.requiredCourseCount || 0),
    });
  };

  return (
    <main className="phoneFrame onboardingFrame newOnboarding">
      <header className="onboardingTop"><strong><span>H</span> Plan H</strong><em>{step + 1} / {steps.length}</em></header>

      <section className="onboardingWelcome">
        <div className="welcomeCopy"><p>AI 학업 어드바이저</p><h1>나만의 학업 계획을<br />플래니와 시작해요</h1><span>입력한 정보는 맞춤 로드맵과 졸업요건 계산에만 사용돼요.</span></div>
        <img src={planiMascot} alt="학업 계획 설정을 안내하는 플래니" />
      </section>

      <div className="onboardingSteps" aria-label="프로필 설정 단계">
        {steps.map((item, index) => <div key={item.label} className={index < step ? 'complete' : index === step ? 'active' : ''}><span>{index < step ? <Check size={14} /> : index + 1}</span><small>{item.label}</small></div>)}
      </div>

      <section className="setupCard">
        <div className="setupHeading"><span><StepIcon size={20} /></span><div><p>STEP {step + 1}</p><h2>{steps[step].title}</h2><small>{steps[step].description}</small></div></div>

        <div className="profileFields">
          {step === 0 && basicFields.map((field) => <Field key={field.key} field={field} value={profile[field.key]} onChange={update} />)}
          {step === 1 && academicFields.map((field) => <Field key={field.key} field={field} value={profile[field.key]} onChange={update} />)}
          {step === 2 && <>
            {preferenceFields.map((field) => <Field key={field.key} field={field} value={profile[field.key]} onChange={update} />)}
            <div className="interestPicker onboardingInterests">
              <span>관심 분야 <small>여러 개 선택할 수 있어요</small></span>
              <div className="interestGrid">{interestKeywords.map((keyword) => <button type="button" key={keyword} className={selectedInterests.includes(keyword) ? 'selected' : ''} onClick={() => toggleInterest(keyword)}>{selectedInterests.includes(keyword) && <Check size={13} />}{keyword}</button>)}</div>
              <div className="otherInterest"><input value={otherInterest} placeholder="직접 입력하기" onChange={(event) => setOtherInterest(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addOtherInterest()} /><button type="button" onClick={addOtherInterest}>추가</button></div>
            </div>
          </>}
        </div>
        {error && <p className="formError">{error}</p>}
      </section>

      <div className="onboardingActions">
        {step > 0 && <Button variant="secondary" onClick={() => { setError(''); setStep(step - 1); }}><ArrowLeft size={17} /> 이전</Button>}
        <Button onClick={step === steps.length - 1 ? finish : next}>{step === steps.length - 1 ? <><Check size={17} /> 설정 완료</> : <>다음 단계 <ArrowRight size={17} /></>}</Button>
      </div>
    </main>
  );
}
