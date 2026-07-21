import { BriefcaseBusiness, CalendarClock, ChevronRight, Sparkles, Trophy } from 'lucide-react';
import Card from '../components/Card';

const opportunities = [
  {
    id: 'contest-policy-ai',
    type: '공모전',
    title: '공공데이터 활용 정책 AI 아이디어톤',
    organizer: '공공데이터포털 · 지자체 연계',
    deadline: '2026-08-28',
    tags: ['정책 AI', '사회과학 데이터 분석', 'AI 윤리'],
    summary: '사회문제 데이터를 분석해 정책 개선 아이디어와 AI 활용안을 제안하는 공모전입니다.',
  },
  {
    id: 'intern-data-analyst',
    type: '인턴',
    title: '데이터 분석 인턴 · 리서치 어시스턴트',
    organizer: '소셜 리서치 랩',
    deadline: '2026-09-06',
    tags: ['사회과학 데이터 분석', '빅데이터 시각화', '사회연결망 분석'],
    summary: '설문·행정·소셜 데이터를 정리하고 대시보드 리포트를 만드는 포지션입니다.',
  },
  {
    id: 'career-nlp',
    type: '취준 공고',
    title: 'NLP 서비스 기획/분석 신입 채용',
    organizer: 'AI 서비스 스타트업',
    deadline: '2026-09-15',
    tags: ['자연어 처리', '미디어 데이터', '비즈니스 데이터'],
    summary: '텍스트 데이터 분석 결과를 바탕으로 서비스 지표와 기능 개선안을 설계합니다.',
  },
  {
    id: 'contest-visualization',
    type: '공모전',
    title: '사회문제 데이터 시각화 챌린지',
    organizer: '데이터저널리즘 네트워크',
    deadline: '2026-10-02',
    tags: ['빅데이터 시각화', '미디어 데이터', 'GIS/공간 데이터'],
    summary: '공개 데이터를 활용해 사회 이슈를 설명하는 인터랙티브 시각화 결과물을 제출합니다.',
  },
  {
    id: 'intern-business-data',
    type: '인턴',
    title: '비즈니스 데이터 운영 체험형 인턴',
    organizer: '커머스 데이터팀',
    deadline: '2026-10-12',
    tags: ['비즈니스 데이터', '데이터베이스', '빅데이터 시각화'],
    summary: '고객 행동 데이터 정제, SQL 기반 리포팅, 실험 지표 모니터링을 경험합니다.',
  },
  {
    id: 'contest-ai-ethics',
    type: '공모전',
    title: '대학생 AI 윤리 정책 제안 공모전',
    organizer: 'AI 거버넌스 포럼',
    deadline: '2026-11-01',
    tags: ['AI 윤리', '정책 AI', '사회과학 데이터 분석'],
    summary: 'AI 안전성, 신뢰성, 공정성 이슈를 학생 관점에서 분석하고 정책 대안을 제안합니다.',
  },
];

function parseInterests(value = '') {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function matchScore(item, interests) {
  return item.tags.reduce((score, tag) => {
    const matched = interests.some((interest) => tag.includes(interest) || interest.includes(tag) || tag.split('/')[0] === interest.split(' ')[0]);
    return matched ? score + 1 : score;
  }, 0);
}

export default function Opportunities({ user }) {
  const interests = parseInterests(user.interests);
  const ranked = [...opportunities]
    .map((item) => ({ ...item, score: matchScore(item, interests) }))
    .sort((a, b) => b.score - a.score || a.deadline.localeCompare(b.deadline));
  const topMatches = ranked.filter((item) => item.score > 0);
  const visible = topMatches.length ? ranked : ranked.slice(0, 4);

  return (
    <div className="pageStack opportunitiesPage">
      <section className="pageIntro">
        <div>
          <p className="eyebrow">서브 추천</p>
          <h2>관심 분야 기반 기회 추천</h2>
          <p>프로필의 관심 키워드를 바탕으로 공모전, 인턴, 취준 공고를 가볍게 추천해요.</p>
        </div>
        <span className="opportunityHeaderIcon"><Sparkles size={20} /></span>
      </section>

      <Card className="opportunityMiniSummary">
        <strong>{interests.length ? `${interests.slice(0, 2).join(', ')} 중심으로 추천 중` : '관심 분야를 설정하면 더 정확해져요'}</strong>
        <p>{topMatches.length ? `${topMatches.length}개의 맞춤 기회를 찾았어요.` : '마이페이지에서 관심 분야를 선택해보세요.'}</p>
      </Card>

      {visible.map((item) => (
        <Card className="opportunityCard" key={item.id}>
          <div className={item.type === '공모전' ? 'opportunityType contest' : 'opportunityType job'}>
            {item.type === '공모전' ? <Trophy size={18} /> : <BriefcaseBusiness size={18} />}
          </div>
          <div>
            <div className="opportunityTitle">
              <span>{item.type} · {item.organizer}</span>
              <h3>{item.title}</h3>
            </div>
            <p>{item.summary}</p>
            <div className="tagRow">
              <span><CalendarClock size={12} /> {item.deadline} 마감</span>
              {item.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
          <ChevronRight size={18} />
        </Card>
      ))}
    </div>
  );
}
