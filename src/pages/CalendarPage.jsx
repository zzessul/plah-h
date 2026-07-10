import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

const categoryClass = {
  수강신청: 'sky',
  시험: 'rose',
  과제: 'orange',
  팀플: 'green',
  '학사 일정': 'indigo',
  졸업: 'purple',
};

export default function CalendarPage({ events, setEvents }) {
  const [selected, setSelected] = useState('2026-07-15');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('과제');
  const monthDays = useMemo(() => Array.from({ length: 31 }, (_, index) => `2026-07-${String(index + 1).padStart(2, '0')}`), []);
  const selectedEvents = events.filter((event) => event.date === selected);

  const addEvent = () => {
    if (!title.trim()) return;
    setEvents([...events, { id: `e-${Date.now()}`, date: selected, title, category }]);
    setTitle('');
  };

  return (
    <div className="pageStack">
      <Card>
        <div className="calendarHeader">
          <h2>2026년 7월</h2>
          <span>{selected.slice(5).replace('-', '월 ')}일</span>
        </div>
        <div className="monthGrid">
          {monthDays.map((date) => {
            const hasEvents = events.filter((event) => event.date === date);
            return (
              <button key={date} className={selected === date ? 'selected' : ''} onClick={() => setSelected(date)}>
                <span>{Number(date.slice(-2))}</span>
                <div>
                  {hasEvents.slice(0, 2).map((event) => <i key={event.id} className={categoryClass[event.category]} />)}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3>선택한 날짜 일정</h3>
        <div className="eventList">
          {selectedEvents.length ? selectedEvents.map((event) => (
            <span key={event.id} className={`eventItem ${categoryClass[event.category]}`}>
              {event.category} · {event.title}
            </span>
          )) : <p>등록된 일정이 없습니다.</p>}
        </div>
      </Card>

      <Card>
        <h3>새 일정 추가</h3>
        <div className="inlineInput">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="일정 이름" />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {Object.keys(categoryClass).map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="iconButton filled" onClick={addEvent} aria-label="일정 추가"><Plus size={18} /></button>
        </div>
        <Button variant="ghost" onClick={addEvent}>선택한 날짜에 추가</Button>
      </Card>
    </div>
  );
}
