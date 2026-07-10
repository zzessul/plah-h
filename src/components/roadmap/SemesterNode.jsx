import { AlertTriangle, Check, Navigation } from 'lucide-react';
import { semesterPositions } from '../../data/roadmapData';

function NodeIcon({ semester }) {
  if (semester.status === 'completed') return <Check size={24} />;
  if (semester.status === 'current') return <Navigation size={22} />;
  if (semester.status === 'attention') return <AlertTriangle size={22} />;
  return <span>{semester.order}</span>;
}

export default function SemesterNode({ semester, isSelected, statusLabel, onClick, nodeRef }) {
  const position = semesterPositions[semester.id];
  const side = position.side;
  const requiredCount = semester.courses.filter((course) => course.required && course.included !== false).length;
  const summary = semester.summary || `${semester.recommendedCredits}학점 · ${semester.courses.length}과목`;

  return (
    <div
      ref={nodeRef}
      className={`semesterStage ${side} ${semester.status} ${isSelected ? 'selected' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <button className="semesterNodeButton" onClick={onClick} aria-label={`${semester.label} 상세 보기`}>
        <NodeIcon semester={semester} />
      </button>
      <button className="semesterNodeText" onClick={onClick}>
        <strong>{semester.label}</strong>
        <span>{summary}</span>
        {requiredCount > 0 && <small>전공필수 {requiredCount}과목</small>}
        {semester.status === 'current' && <em>현재</em>}
        {semester.status === 'attention' && <em>주의</em>}
        <i>{statusLabel}</i>
      </button>
    </div>
  );
}
