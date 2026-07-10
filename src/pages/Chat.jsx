import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { aiKnowledge, sourceDocs } from '../data/mockData';
import { getAiAnswer } from '../utils/graduation';

export default function Chat({ chat, setChat, user }) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState(null);

  const ask = (question) => {
    if (!question.trim()) return;
    const answer = getAiAnswer(question, aiKnowledge, user);
    setChat([...chat, { role: 'user', text: question, sources: [] }, { role: 'assistant', text: answer.a, sources: answer.sources }]);
    setInput('');
  };

  return (
    <div className="chatPage">
      <Card className="suggestions">
        <h3><Sparkles size={18} /> 추천 질문</h3>
        {aiKnowledge.map((item) => (
          <button key={item.q} onClick={() => ask(item.q)}>{item.q}</button>
        ))}
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
