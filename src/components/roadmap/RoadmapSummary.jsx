import { Compass } from 'lucide-react';
import Button from '../Button';
import Card from '../Card';

export default function RoadmapSummary({ actualCredits, totalCredits, remainingCredits, completedCount, onShowAll, onShowCurrent }) {
  return (
    <div className="roadmapIntro">
      <div>
        <p className="eyebrow">AI 학업 여정</p>
        <h2>나의 졸업 로드맵</h2>
        <p>입학부터 졸업까지 학기별 추천 과목을 확인해보세요.</p>
      </div>
      <Card className="roadmapSummaryCard">
        <div className="summaryIcon"><Compass size={22} /></div>
        <div>
          <span>현재 위치</span>
          <strong>4학년 1학기</strong>
        </div>
        <div>
          <span>이수 학점</span>
          <strong>{actualCredits} / {totalCredits}학점</strong>
        </div>
        <div>
          <span>졸업까지</span>
          <strong>{remainingCredits}학점</strong>
        </div>
        <div>
          <span>완료 학기</span>
          <strong>{completedCount} / 8</strong>
        </div>
      </Card>
      <div className="roadmapViewActions">
        <Button variant="secondary" onClick={onShowAll}>전체 보기</Button>
        <Button onClick={onShowCurrent}>현재 학기 보기</Button>
      </div>
    </div>
  );
}
