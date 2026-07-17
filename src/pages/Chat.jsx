import { Send, Settings, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/Modal';
import planiMascot from '../assets/plani-mascot.png';
import { aiKnowledge, sourceDocs } from '../data/ssai/officialAppData';
import { getAiAnswer } from '../utils/graduation';

const questions = ['졸업요건 알려줘', '다음 학기 추천 과목', '전공필수 체크', '수강신청 대안'];

export default function Chat({ chat, setChat, user, metrics, events = [] }) {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState(`${user.name || 'SSAI 학생'}님, 무엇을 도와드릴까요?`);
  const [answerKey, setAnswerKey] = useState(0);
  const [sources, setSources] = useState([]);
  const [source, setSource] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const ask = (question) => {
    if (!question.trim()) return;
    const result = getAiAnswer(question, aiKnowledge, user);
    const nextEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0];
    let text = result.a.replace('108학점', `${metrics.earnedCredits}학점`).replace('26학점', `${metrics.remainingCredits}학점`);
    if (question.includes('일정') && nextEvent) text = `가장 가까운 일정은 ${nextEvent.date}의 ‘${nextEvent.title}’이에요. 캘린더에서 알림과 시간을 관리할 수 있어요.`;
    setAnswer(text);
    setSources(result.sources || []);
    setAnswerKey((value) => value + 1);
    setChat([...chat, { role: 'user', text: question, sources: [] }, { role: 'assistant', text, sources: result.sources || [] }]);
    setInput('');
  };

  return (
    <div className="aiConsultPage">
      <section className="aiIntro"><div><p className="eyebrow">Plan H AI 어드바이저</p><h2>플래니와 학업 계획을 세워봐요</h2></div><button className="iconButton" onClick={() => setSettingsOpen(true)} aria-label="AI 상담 설정"><Settings size={18} /></button></section>
      <section className="advisorStage">
        <div key={answerKey} className="advisorSpeech"><span>플래니가 알려드려요</span><p>{answer}</p>{sources.length > 0 && <div>{sources.map((item) => <button key={item} onClick={() => setSource(item)}>{item}</button>)}</div>}</div>
        <img src={planiMascot} alt="AI 학업 상담 부엉이 플래니" />
        <div className="advisorName"><strong>플래니</strong><span>SSAI 학업 메이트</span></div>
      </section>
      <section className="suggestedArea"><h3><Sparkles size={17} /> 추천 질문</h3><div>{questions.map((question) => <button key={question} onClick={() => ask(question)}>{question}</button>)}</div></section>
      <form className="advisorInput" onSubmit={(event) => { event.preventDefault(); ask(input); }}><label className="srOnly" htmlFor="advisor-question">질문 입력</label><input id="advisor-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="질문을 입력해주세요" /><button type="submit" aria-label="질문 전송"><Send size={18} /></button></form>
      {source && <Modal title={source} onClose={() => setSource(null)}><p>{sourceDocs[source]}</p></Modal>}
      {settingsOpen && <Modal title="AI 상담 설정" onClose={() => setSettingsOpen(false)}><p>답변은 SSAI 공식 교육과정과 졸업요건 데이터에 기반합니다. 학교별 승인이나 시간표 정보는 공식 시스템에서 최종 확인해주세요.</p></Modal>}
    </div>
  );
}
