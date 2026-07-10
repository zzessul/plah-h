import { GraduationCap } from 'lucide-react';

export default function GraduationNode({ ready }) {
  return (
    <div className={`graduationStage ${ready ? 'ready' : 'blocked'}`}>
      <div className="graduationBadge">
        <GraduationCap size={28} />
      </div>
      <div>
        <strong>졸업</strong>
        <span>{ready ? '2026년 2학기 졸업 예정' : '졸업요건 확인 필요'}</span>
      </div>
    </div>
  );
}
