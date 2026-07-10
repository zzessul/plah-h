import { Bell, Bot, CalendarDays, Home, Map, RotateCcw, Settings, Table2 } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

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

export default function AppShell({ activeTab, setActiveTab, onReset, onEditProfile, children }) {
  const [panel, setPanel] = useState(null);

  const resetWithConfirm = () => {
    onReset();
    setPanel(null);
  };

  return (
    <main className="phoneFrame">
      <header className="topBar">
        <button className="iconButton" onClick={() => setPanel('reset')} aria-label="초기화">
          <RotateCcw size={18} />
        </button>
        <h1>{titles[activeTab]}</h1>
        <div className="topActions">
          <button className="iconButton" onClick={() => setPanel('settings')} aria-label="설정">
            <Settings size={18} />
          </button>
          <button className="iconButton" onClick={() => setPanel('alerts')} aria-label="알림">
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
      {panel === 'alerts' && (
        <Modal title="주요 알림" onClose={() => setPanel(null)}>
          <div className="eventList">
            <span>전공필수 1과목 미이수 가능성이 있어요.</span>
            <span>8월 4일 수강신청 전 Plan B를 확인하세요.</span>
            <span>졸업인증 제출 상태를 점검해야 합니다.</span>
          </div>
        </Modal>
      )}
      {panel === 'settings' && (
        <Modal title="설정" onClose={() => setPanel(null)}>
          <div className="settingsList">
            <button onClick={() => { onEditProfile(); setPanel(null); }}>사용자 정보 수정</button>
            <button onClick={() => setPanel('reset')}>시연 데이터 초기화</button>
            <p>Plan H는 외부 학교 서버와 연결되지 않은 시연용 mock 데이터 앱입니다.</p>
          </div>
        </Modal>
      )}
      {panel === 'reset' && (
        <Modal title="데이터 초기화" onClose={() => setPanel(null)}>
          <p>사용자 정보, 로드맵, 시간표, 캘린더, AI 상담 기록을 기본 데모 상태로 되돌릴까요?</p>
          <div className="buttonGrid">
            <Button variant="secondary" onClick={() => setPanel(null)}>취소</Button>
            <Button onClick={resetWithConfirm}>초기화</Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
