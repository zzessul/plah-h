import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';

const categoryClass = {
  수강신청: 'sky',
  시험: 'rose',
  과제: 'orange',
  팀플: 'green',
  '학사 일정': 'indigo',
  학사일정: 'indigo',
  졸업: 'sky',
  '개인 일정': 'green',
};

export default function CalendarPage({ events, setEvents }) {
  const [selected, setSelected] = useState('2026-07-15');
  const [month, setMonth] = useState('2026-07');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('과제');
  const [filter, setFilter] = useState('전체');
  const [editing, setEditing] = useState(null);
  const monthDays = useMemo(() => {
    const [year, monthIndex] = month.split('-').map(Number);
    const lastDay = new Date(year, monthIndex, 0).getDate();
    const leading = new Date(year, monthIndex - 1, 1).getDay();
    return [...Array.from({ length: leading }, () => null), ...Array.from({ length: lastDay }, (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`)];
  }, [month]);
  const selectedEvents = events.filter((event) => event.date === selected);
  const visibleEvents = filter === '전체' ? selectedEvents : selectedEvents.filter((event) => event.category === filter);

  const addEvent = () => {
    if (!title.trim()) return;
    setEvents([...events, { id: `e-${Date.now()}`, date: selected, title, category, startTime: '09:00', endTime: '10:00', description: '시연 중 추가한 일정입니다.', notify: true }]);
    setTitle('');
  };
  const shiftMonth = (delta) => {
    const [year, monthIndex] = month.split('-').map(Number);
    const next = new Date(year, monthIndex - 1 + delta, 1);
    const nextMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    setMonth(nextMonth);
    setSelected(`${nextMonth}-01`);
  };
  const updateEvent = () => {
    setEvents(events.map((event) => (event.id === editing.id ? editing : event)));
    setEditing(null);
  };
  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
    setEditing(null);
  };

  return (
    <div className="pageStack">
      <Card className="calendarCard">
        <div className="calendarHeader">
          <button className="iconButton" onClick={() => shiftMonth(-1)} aria-label="이전 달"><ChevronLeft size={18} /></button>
          <h2>{month.replace('-', '년 ')}월</h2>
          <button className="iconButton" onClick={() => shiftMonth(1)} aria-label="다음 달"><ChevronRight size={18} /></button>
        </div>
        <span className="selectedDateLabel">선택한 날짜 · {selected.slice(5).replace('-', '월 ')}일</span>
        <Button variant="ghost" onClick={() => { setMonth('2026-07'); setSelected('2026-07-15'); }}>오늘로 이동</Button>
        <div className="weekdayRow">{['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="monthGrid">
          {monthDays.map((date, index) => {
            if (!date) return <span className="emptyDay" key={`empty-${index}`} aria-hidden="true" />;
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

      <Card className="calendarPanel">
        <h3>선택한 날짜 일정</h3>
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option>전체</option>
          {Object.keys(categoryClass).map((item) => <option key={item}>{item}</option>)}
        </select>
        <div className="eventList">
          {visibleEvents.length ? visibleEvents.map((event) => (
            <button key={event.id} className={`eventItem ${categoryClass[event.category]}`} onClick={() => setEditing(event)}>
              {event.category} · {event.title}
            </button>
          )) : <p>등록된 일정이 없습니다.</p>}
        </div>
      </Card>

      <Card className="calendarPanel">
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
      {editing && (
        <Modal title="일정 수정" onClose={() => setEditing(null)}>
          <div className="settingsList">
            <label>일정명<input value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></label>
            <label>날짜<input type="date" value={editing.date} onChange={(event) => setEditing({ ...editing, date: event.target.value })} /></label>
            <label>시작 시간<input type="time" value={editing.startTime || '09:00'} onChange={(event) => setEditing({ ...editing, startTime: event.target.value })} /></label>
            <label>종료 시간<input type="time" value={editing.endTime || '10:00'} onChange={(event) => setEditing({ ...editing, endTime: event.target.value })} /></label>
            <label>카테고리<select value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })}>{Object.keys(categoryClass).map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>설명<input value={editing.description || ''} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
            <label className="switchRow"><input type="checkbox" checked={!!editing.notify} onChange={(event) => setEditing({ ...editing, notify: event.target.checked })} />알림 받기</label>
            <div className="buttonGrid">
              <Button variant="secondary" onClick={() => deleteEvent(editing.id)}><Trash2 size={16} /> 삭제</Button>
              <Button onClick={updateEvent}>저장</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
