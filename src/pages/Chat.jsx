import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { aiKnowledge, sourceDocs } from '../data/mockData';
import { getAiAnswer } from '../utils/graduation';

export default function Chat({ chat, setChat, user, metrics, events = [] }) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState(null);

  const ask = (question) => {
    if (!question.trim()) return;
    const answer = getAiAnswer(question, aiKnowledge, user);
    const nextEvent = [...events].sort((a, b) => a.date.localeCompare(b.date))[0];
    const dynamicText = question.includes('학사') || question.includes('일정')
      ? `${user.name}님에게 가장 가까운 일정은 ${nextEvent?.date || '2026-07-15'} ${nextEvent?.title || '수강편람 공개'}입니다. 캘린더 탭에서 과제, 팀플, 졸업 관련 일정을 추가로 관리할 수 있어요.`
      : answer.a
          .replace('108학점', `${metrics.earnedCredits}학점`)
          .replace('26학점', `${metrics.remainingCredits}학점`);
    setChat([...chat, { role: 'user', text: question, sources: [] }, { role: 'assistant', text: dynamicText, sources: answer.sources }]);
    setInput('');
  };
  const clearChat = () => {
    setChat([{ role: 'assistant', text: '대화를 초기화했어요. 졸업요건, 추천 과목, 시간표, 학사일정을 다시 물어볼 수 있어요.', sources: [] }]);
  };

  return (
    <div className="chatPage">
      <Card className="suggestions">
        <h3><Sparkles size={18} /> 추천 질문</h3>
        {aiKnowledge.map((item) => (
          <button key={item.q} onClick={() => ask(item.q)}>{item.q}</button>
        ))}
        <Button variant="ghost" onClick={clearChat}>대화 초기화</Button>
      </Card>

      <div className="messages">
        {chat.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
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

      {source && (
        <Modal title={source} onClose={() => setSource(null)}>
          <p>{sourceDocs[source]}</p>
        </Modal>
      )}
    </div>
  );
}
