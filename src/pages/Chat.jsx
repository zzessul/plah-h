import { Send, Settings, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/Modal';
import planiMascot from '../assets/plani-mascot.png';
import { aiKnowledge, official2026SecondSemesterCourses, sourceDocs } from '../data/ssai/officialAppData';
import { getAiAnswer } from '../utils/graduation';

const questions = ['졸업요건 알려줘', '다음 학기 추천 과목', '전공필수 체크', '수강신청 대안'];
const answerSources = ['SSAI 공식 졸업요건', 'SSAI 공식 교육과정', '한국외대 2026-2 SSAI 강의시간표'];

function compactCourse(course) {
  const review = course.etaReview?.rating ? `, 에타 ${course.etaReview.rating.toFixed(2)}` : '';
  return `${course.courseName}(${course.professor}, ${course.day}${course.periods.join('')}${review})`;
}

function buildDirectAnswer(question, user, metrics) {
  const normalized = question.replace(/\s/g, '');
  const requiredArea = metrics.areas.find((area) => area.key === 'requiredCourses');
  const weakAreas = metrics.areas.filter((area) => area.status !== '충족');
  const requiredCourses = official2026SecondSemesterCourses.filter((course) => course.isRequired);
  const dataCourses = official2026SecondSemesterCourses
    .filter((course) => /데이터|시각화|프로그래밍|자료구조|클라우드/.test(course.courseName))
    .sort((a, b) => (b.etaReview?.rating || 0) - (a.etaReview?.rating || 0));
  const backupCourses = official2026SecondSemesterCourses
    .filter((course) => course.etaReview?.teamProject?.includes('없음') || course.etaReview?.rating)
    .sort((a, b) => (b.etaReview?.rating || 0) - (a.etaReview?.rating || 0));

  if (normalized.includes('졸업요건') || normalized.includes('졸업')) {
    const nextActions = weakAreas.slice(0, 3).map((area) => `${area.label} ${area.earned}/${area.required}`).join(', ');
    return {
      text: `${user.name || 'SSAI 학생'}님 기준으로 졸업까지 ${metrics.remainingCredits}학점 남았어요. 지금 우선순위는 ${nextActions || '남은 영역 없음'}입니다. 이번 학기에는 전공필수와 외국어인증을 먼저 마무리하고, 남은 학점은 SSAI 전공선택으로 채우는 플랜이 가장 깔끔해요.`,
      sources: ['SSAI 공식 졸업요건', 'SSAI 공식 교육과정'],
    };
  }

  if (normalized.includes('전공필수')) {
    return {
      text: `전공필수는 현재 ${requiredArea?.earned || 0}/${requiredArea?.required || 0}개 완료 기준이에요. 2026-2에 바로 노릴 과목은 ${requiredCourses.map(compactCourse).join(', ')}입니다. 우선순위는 데이터베이스, 소셜데이터프로그래밍기초, 자료구조 순으로 두면 졸업요건과 시간표 안정성이 좋아요.`,
      sources: answerSources,
    };
  }

  if (normalized.includes('추천과목') || normalized.includes('다음학기') || normalized.includes('데이터')) {
    const picked = dataCourses.slice(0, 4);
    return {
      text: `다음 학기 추천은 ${picked.map(compactCourse).join(', ')}예요. 데이터 분석 관심이면 데이터베이스와 산업데이터시각화를 먼저 넣고, 전공필수 보강이 필요하면 소셜데이터프로그래밍기초 또는 자료구조를 같이 넣는 조합을 추천해요.`,
      sources: answerSources,
    };
  }

  if (normalized.includes('수강신청') || normalized.includes('대안') || normalized.includes('실패')) {
    return {
      text: `수강신청 대안은 이렇게 잡으면 돼요. 1순위는 전공필수 3개, 2순위는 평점/부담이 좋은 ${backupCourses.slice(0, 3).map(compactCourse).join(', ')}, 3순위는 금공강·팀플 조건에 맞춰 자동 생성한 Plan A입니다. 실패한 과목이 생기면 시간표 탭의 ‘수강신청 결과 반영’에서 과목을 누르면 대체 플랜으로 바로 바꿀 수 있어요.`,
      sources: answerSources,
    };
  }

  return null;
}

export default function Chat({ chat, setChat, user, metrics, events = [] }) {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState(`${user.name || 'SSAI 학생'}님, 무엇을 도와드릴까요?`);
  const [answerKey, setAnswerKey] = useState(0);
  const [sources, setSources] = useState([]);
  const [source, setSource] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const visibleChat = chat.length ? chat : [{ role: 'assistant', text: answer, sources: [] }];

  const ask = (question) => {
    if (!question.trim()) return;
    const direct = buildDirectAnswer(question, user, metrics);
    const result = direct || getAiAnswer(question, aiKnowledge, user);
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
    const nextEvent = [...events].filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0]
      || [...events].sort((a, b) => b.date.localeCompare(a.date))[0];
    let text = (result.text || result.a).replace('108학점', `${metrics.earnedCredits}학점`).replace('26학점', `${metrics.remainingCredits}학점`);
    if (question.includes('일정') && nextEvent) text = `가장 가까운 일정은 ${nextEvent.date}의 ‘${nextEvent.title}’이에요. 캘린더에서 알림과 시간을 관리할 수 있어요.`;
    setAnswer(text);
    setSources(result.sources || []);
    setAnswerKey((value) => value + 1);
    setChat((current) => [...current, { role: 'user', text: question, sources: [] }, { role: 'assistant', text, sources: result.sources || [] }]);
    setInput('');
  };

  return (
    <div className="aiConsultPage">
      <section className="aiIntro"><div><p className="eyebrow">Plan H AI 어드바이저</p><h2>플래니와 학업 계획을 세워봐요</h2></div><button className="iconButton" onClick={() => setSettingsOpen(true)} aria-label="AI 상담 설정"><Settings size={18} /></button></section>
      <section className="advisorStage compact">
        <div key={answerKey} className="advisorSpeech"><span>플래니가 알려드려요</span><p>{answer}</p>{sources.length > 0 && <div>{sources.map((item) => <button key={item} onClick={() => setSource(item)}>{item}</button>)}</div>}</div>
        <img src={planiMascot} alt="AI 학업 상담 부엉이 플래니" />
        <div className="advisorName"><strong>플래니</strong><span>SSAI 학업 메이트</span></div>
      </section>
      <section className="suggestedArea"><h3><Sparkles size={17} /> 추천 질문</h3><div>{questions.map((question) => <button key={question} onClick={() => ask(question)}>{question}</button>)}</div></section>
      <section className="messages aiMessageList" aria-label="AI 상담 대화 내역">
        {visibleChat.slice(-8).map((message, index) => (
          <div key={`${message.role}-${index}-${message.text}`} className={`message ${message.role}`}>
            {message.role === 'assistant' && <span className="miniPlaniAvatar"><img src={planiMascot} alt="" /></span>}
            <div className="messageBubble">
              {message.role === 'assistant' && <strong className="messageLabel">플래니</strong>}
              <p>{message.text}</p>
              {!!message.sources?.length && (
                <div className="sourceCards">
                  {message.sources.map((item) => <button key={item} onClick={() => setSource(item)}>{item}</button>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
      <form className="advisorInput" onSubmit={(event) => { event.preventDefault(); ask(input); }}><label className="srOnly" htmlFor="advisor-question">질문 입력</label><input id="advisor-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="질문을 입력해주세요" /><button type="submit" aria-label="질문 전송"><Send size={18} /></button></form>
      {source && <Modal title={source} onClose={() => setSource(null)}><p>{sourceDocs[source] || '공식 SSAI 데이터와 앱 내 이수 현황을 기준으로 생성한 참고 답변입니다.'}</p></Modal>}
      {settingsOpen && <Modal title="AI 상담 설정" onClose={() => setSettingsOpen(false)}><p>답변은 SSAI 공식 교육과정과 졸업요건 데이터에 기반합니다. 학교별 승인이나 시간표 정보는 공식 시스템에서 최종 확인해주세요.</p></Modal>}
    </div>
  );
}
