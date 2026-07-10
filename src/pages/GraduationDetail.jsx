import Card from '../components/Card';
import Button from '../components/Button';

const extraItems = [
  ['외국어 인증', '확인 필요', '졸업인증 제출 전까지 증빙을 준비해야 합니다.'],
  ['졸업시험 또는 졸업논문', '진행 중', '캡스톤디자인 결과물로 대체 가능 여부를 확인하세요.'],
  ['교환학생 인정 학점', '확인 필요', '교환학생 경험이 있다면 학점인정 심사를 확인하세요.'],
  ['재수강 과목', '충족', '현재 졸업학점에서 제외될 재수강 과목은 없습니다.'],
];

export default function GraduationDetail({ metrics, setActiveTab }) {
  return (
    <div className="pageStack">
      <Card className="detailSummary">
        <p className="eyebrow">총 졸업학점</p>
        <h2>{metrics.earnedCredits} / {metrics.totalRequired}학점</h2>
        <span className="statusPill warn">{metrics.status}</span>
      </Card>
      {metrics.areas.map((area) => (
        <Card key={area.key} className="detailRow">
          <div>
            <h3>{area.label}</h3>
            <p>{area.detail}</p>
          </div>
          <span className={`statusPill ${area.status === '충족' ? 'ok' : area.status === '미충족' ? 'danger' : 'warn'}`}>{area.status}</span>
          {area.status !== '충족' && <p className="solution">{area.label} {Math.max(area.required - area.earned, 0)}학점 부족 - 추가 수강 또는 인증 확인이 필요합니다.</p>}
        </Card>
      ))}
      {extraItems.map(([title, status, text]) => (
        <Card key={title} className="detailRow">
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <span className={`statusPill ${status === '충족' ? 'ok' : 'warn'}`}>{status}</span>
        </Card>
      ))}
      <Button onClick={() => setActiveTab('home')}>홈으로 돌아가기</Button>
    </div>
  );
}
