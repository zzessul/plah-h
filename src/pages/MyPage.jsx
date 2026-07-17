import { Bell, ChevronRight, Flag, Heart, Info, MessageCircle, RotateCcw, SlidersHorizontal, UserRound } from 'lucide-react';
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';

const menu = [
  [Flag, '학업 목표 설정', '졸업 목표와 학기당 학점'],
  [Heart, '관심 분야', '추천 과목 개인화'],
  [Bell, '알림 설정', '학사일정과 수강신청 알림'],
  [SlidersHorizontal, '앱 설정', '화면과 데이터 설정'],
  [MessageCircle, '문의 및 피드백', 'Plan H에 의견 보내기'],
  [Info, '앱 정보', 'Plan H · SSAI 공식 자료 기반'],
];

export default function MyPage({ user, onEditProfile, onReset, setActiveTab }) {
  const [modal, setModal] = useState(null);
  const interests = String(user.interests || '').split(',').map((item) => item.trim()).filter(Boolean);
  const openMenu = (title) => {
    if (title === '학업 목표 설정') return setActiveTab('detail');
    if (title === '관심 분야') return onEditProfile();
    if (title === '알림 설정') return setActiveTab('calendar');
    if (title === '앱 설정') return setModal('settings');
    if (title === '문의 및 피드백') return setActiveTab('chat');
    return setModal('info');
  };

  return (
    <div className="pageStack profilePage">
      <Card className="profileCard">
        <div className="profileAvatar"><UserRound size={30} /></div>
        <div><p className="eyebrow">{user.studentId}</p><h2>{user.name || 'SSAI 학생'}</h2><p>{user.primaryMajor}</p><span>{user.secondMajor}</span></div>
        <Button variant="secondary" onClick={onEditProfile}>내 정보 수정</Button>
      </Card>
      <section><div className="sectionHeader"><h3>관심 분야</h3></div><div className="interestTags">{interests.length ? interests.map((item) => <span key={item}>{item}</span>) : <button onClick={onEditProfile}>관심 분야 설정하기</button>}</div></section>
      <Card className="profileMenu">
        {menu.map(([Icon, title, detail]) => <button key={title} onClick={() => openMenu(title)}><span className="menuIcon"><Icon size={18} /></span><span><strong>{title}</strong><small>{detail}</small></span><ChevronRight size={18} /></button>)}
      </Card>
      <button className="resetButton" onClick={onReset}><RotateCcw size={17} /> 시연 데이터 초기화</button>
      <button className="textButton" onClick={() => setActiveTab('home')}>홈으로 돌아가기</button>
      {modal === 'settings' && (
        <Modal title="앱 설정" onClose={() => setModal(null)}>
          <div className="settingsList">
            <p>Plan H는 SSAI 공식 교육과정, 2026-2 강의시간표, 2026학년도 학사일정을 기준으로 구성된 시연용 프로토타입입니다.</p>
            <Button onClick={onEditProfile}>프로필 다시 설정</Button>
            <Button variant="secondary" onClick={onReset}>시연 데이터 초기화</Button>
          </div>
        </Modal>
      )}
      {modal === 'info' && (
        <Modal title="앱 정보" onClose={() => setModal(null)}>
          <p>Plan H · 한국외국어대학교 SSAI 학생 고객검증용 AI 학업 관리 프로토타입</p>
        </Modal>
      )}
    </div>
  );
}
