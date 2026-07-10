import { HelpCircle, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import planiMascot from '../assets/plani-mascot.png';
import { aiKnowledge, sourceDocs } from '../data/mockData';
import { getAiAnswer } from '../utils/graduation';

const planiLines = [
  '무엇이 궁금한가요?',
  '졸업까지 남은 학점을 알려드릴게요!',
  '다음 학기 추천 과목도 볼 수 있어요.',
  '수강신청 실패 대비 플랜도 준비했어요.',
];

const suggestedQuestions = [
  '졸업하려면 어떤 과목을 더 들어야 해?',
  '다음 학기 전공필수 과목 추천해줘.',
  '데이터 분석 관련 과목 알려줘.',
  '수강신청 실패하면 어떻게 해야 해?',
  '이번 학기에 15학점만 들어도 괜찮아?',
  '내 졸업요건 상태 알려줘.',
];

export default function Chat({ chat, setChat, user, metrics, events = [] }) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [speech, setSpeech] = useState(() => {
    const name = user.name?.trim();
    return name ? `${name}님, 졸업까지 ${metrics.remainingCredits}학점 남았어요!` : '무엇이 궁금한가요?';
  });
  const [imageFailed, setImageFailed] = useState(false);

  const ask = (question) => {
    if (!question.trim()) return;
    const answer = getAiAnswer(question, aiKnowledge, user);
    const nextEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0];
    const prefix = question.includes('수강신청')
      ? '수강신청에 실패해도 괜찮아요. '
      : question.includes('졸업')
        ? '현재 기준으로 보면, '
        : question.includes('과목') || question.includes('데이터')
          ? '플래니가 정리해드릴게요. '
          : '좋아요, 확인해볼게요. ';
    const dynamicText = question.includes('학사') || question.includes('일정')
      ? `${user.name || 'SSAI 학생'}님에게 가장 가까운 일정은 ${nextEvent?.date || '2026-07-15'} ${nextEvent?.title || '수강편람 공개'}입니다. 캘린더 탭에서 과제, 팀플, 졸업 관련 일정을 추가로 관리할 수 있어요.`
      : `${prefix}${answer.a
          .replace('108학점', `${metrics.earnedCredits}학점`)
          .replace('26학점', `${metrics.remainingCredits}학점`)}`;
    setChat([...chat, { role: 'user', text: question, sources: [] }, { role: 'assistant', text: dynamicText, sources: answer.sources }]);
    setSpeech(question.includes('졸업') ? `졸업까지 ${metrics.remainingCredits}학점 남았어요.` : planiLines[Math.floor(Math.random() * planiLines.length)]);
    setInput('');
  };
  const clearChat = () => {
    setChat([{ role: 'assistant', text: '대화를 초기화했어요. 졸업요건, 추천 과목, 시간표, 학사일정을 다시 물어볼 수 있어요.', sources: [] }]);
    setSpeech('질문을 선택하거나 직접 입력해보세요.');
  };

  return (
    <div className="chatPage planiChatPage">
      <section className="planiHeader">
        <p className="eyebrow">AI 상담</p>
        <h2>플래니가 학업 계획과 졸업 준비를 도와줄게요</h2>
        <span>상담 중 · 계획 도우미 · 졸업 체크 중</span>
      </section>

      <section className="planiHero">
        <div className="planiSpeech">{speech}</div>
        <button
          className="planiMascotButton"
          onClick={() => setSpeech(planiLines[Math.floor(Math.random() * planiLines.length)])}
          aria-label="플래니에게 말 걸기"
        >
          {!imageFailed ? (
            <img src={planiMascot} alt="학사모를 쓴 AI 학업 상담 부엉이 플래니" onError={() => setImageFailed(true)} />
          ) : (
            <div className="planiFallback">플래니</div>
          )}
        </button>
        <div className="planiBadge">
          <strong>플래니</strong>
          <span>졸업요건, 시간표, 수강신청을 함께 도와주는 AI 학업 메이트</span>
        </div>
        <button className="planiIntroButton" onClick={() => setIntroOpen(true)}>
          <HelpCircle size={15} /> 나는 누구?
        </button>
      </section>

      <Card className="suggestions planiSuggestions">
        <h3><Sparkles size={18} /> 추천 질문</h3>
        <div className="suggestionChips">
          {suggestedQuestions.map((question) => (
            <button key={question} onClick={() => ask(question)}>{question}</button>
          ))}
        </div>
        <Button variant="ghost" onClick={clearChat}>대화 초기화</Button>
      </Card>

      <div className="messages">
        {chat.length <= 1 && (
          <div className="planiEmptyState">
            <strong>질문을 선택하거나 직접 입력해보세요</strong>
            <span>플래니가 SSAI 졸업요건과 다음 학기 계획을 함께 정리해드릴게요.</span>
          </div>
        )}
        {chat.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
            {message.role === 'assistant' && <strong className="messageLabel">플래니</strong>}
            <p>{message.text}</p>
            {!!message.sources.length && (
              <div className="sourceCards">
                {message.sources.map((item) => <button key={item} onClick={() => setSource(item)}>{item}</button>)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="chatInput">
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && ask(input)} placeholder="졸업요건을 물어보세요" />
        <button className="iconButton filled" onClick={() => ask(input)} aria-label="전송"><Send size={18} /></button>
      </div>

      {introOpen && (
        <Modal title="플래니 소개" onClose={() => setIntroOpen(false)}>
          <Card className="planiIntroCard">
            <strong>플래니는 학업 계획과 졸업 준비를 돕는 AI 부엉이예요.</strong>
            <p>한국외대 SSAI 학생의 이수 학점, 전공필수, 시간표 대안, 학사일정을 시연용 데이터로 함께 확인해드려요.</p>
          </Card>
        </Modal>
      )}

      {source && (
        <Modal title={source} onClose={() => setSource(null)}>
          <p>{sourceDocs[source]}</p>
        </Modal>
      )}
    </div>
  );
}
