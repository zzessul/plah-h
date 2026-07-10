import { roadmapPath, roadmapSegments } from '../../data/roadmapData';

function segmentClass(from, semesters) {
  const semester = semesters.find((item) => item.order === from);
  if (!semester) return 'planned';
  if (semester.status === 'completed') return 'completed';
  if (semester.status === 'current') return 'current';
  if (semester.status === 'attention') return 'attention';
  return 'planned';
}

export default function RoadmapPath({ semesters }) {
  return (
    <svg className="roadSvg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="roadBase" d={roadmapPath} />
      {roadmapSegments.map((segment) => (
        <path key={segment.id} className={`roadSegment ${segmentClass(segment.from, semesters)}`} d={segment.d} />
      ))}
    </svg>
  );
}
