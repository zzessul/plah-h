import { Bell, Bot, CalendarDays, Home, Map, RotateCcw, Settings, Table2 } from 'lucide-react';

const tabs = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'roadmap', label: '로드맵', icon: Map },
  { id: 'timetable', label: '시간표', icon: Table2 },
  { id: 'calendar', label: '캘린더', icon: CalendarDays },
  { id: 'chat', label: 'AI 상담', icon: Bot },
];

const titles = {
  home: 'Plan H',
  detail: '졸업요건 상세',
  roadmap: '학업 로드맵',
  timetable: '추천 시간표',
  calendar: '학사 캘린더',
  chat: 'AI 상담',
};

export default function AppShell({ activeTab, setActiveTab, onReset, children }) {
  return (
    <main className="phoneFrame">
      <header className="topBar">
        <button className="iconButton" onClick={onReset} aria-label="초기화">
          <RotateCcw size={18} />
        </button>
        <h1>{titles[activeTab]}</h1>
        <div className="topActions">
          <button className="iconButton" aria-label="설정">
            <Settings size={18} />
          </button>
          <button className="iconButton" aria-label="알림">
            <Bell size={18} />
          </button>
        </div>
      </header>
      <div className="screen">{children}</div>
      <nav className="bottomNav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}
