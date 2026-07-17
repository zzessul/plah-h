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
  const [feedback, setFeedback] = useState({ type: '사용성 피드백', message: '', contact: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const interests = String(user.interests || '').split(',').map((item) => item.trim()).filter(Boolean);
  const openMenu = (title) => {
    if (title === '학업 목표 설정') return setActiveTab('detail');
    if (title === '관심 분야') return onEditProfile();
    if (title === '알림 설정') return setActiveTab('calendar');
    if (title === '앱 설정') return setModal('settings');
    if (title === '문의 및 피드백') {
      setFeedbackSent(false);
      return setModal('feedback');
    }
    return setModal('info');
  };
  const submitFeedback = (event) => {
    event.preventDefault();
    if (!feedback.message.trim()) return;
    setFeedbackSent(true);
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
      {modal === 'feedback' && (
        <Modal title="문의 및 피드백" onClose={() => setModal(null)}>
          {feedbackSent ? (
            <div className="feedbackDone">
              <strong>의견이 접수되었습니다.</strong>
              <p>시연용 프로토타입이라 실제 서버 전송은 연결하지 않았지만, 입력 흐름과 접수 화면을 확인할 수 있어요.</p>
              <Button onClick={() => setModal(null)}>확인</Button>
            </div>
          ) : (
            <form className="feedbackForm" onSubmit={submitFeedback}>
              <label>유형
                <select value={feedback.type} onChange={(event) => setFeedback({ ...feedback, type: event.target.value })}>
                  <option>사용성 피드백</option>
                  <option>오류 제보</option>
                  <option>데이터 수정 요청</option>
                  <option>기능 제안</option>
                </select>
              </label>
              <label>의견 내용
                <textarea value={feedback.message} onChange={(event) => setFeedback({ ...feedback, message: event.target.value })} placeholder="불편했던 점이나 추가되면 좋을 기능을 적어주세요." rows={5} />
              </label>
              <label>연락처 또는 이메일 <span>선택</span>
                <input value={feedback.contact} onChange={(event) => setFeedback({ ...feedback, contact: event.target.value })} placeholder="답변이 필요하면 입력해주세요" />
              </label>
              <Button type="submit">의견 보내기</Button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
