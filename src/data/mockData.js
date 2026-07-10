export const demoUser = {
  name: '최서린',
  studentId: '202200000',
  school: '한국외국어대학교',
  admissionYear: '2022',
  grade: '4학년',
  semester: '1학기',
  primaryMajor: '융합일본지역전공',
  secondMajor: '융복합소프트웨어전공',
  exchange: '없음',
  interests: '데이터 분석, 일본 지역 비즈니스',
  preferredTime: '오후 수업',
  freeDay: '월요일',
  teamwork: '낮음',
  onlinePreference: '보통',
};

export const requirements = {
  totalCredits: 134,
  primaryMajor: { label: '제1전공', required: 42, earned: 40 },
  secondMajor: { label: '제2전공', required: 42, earned: 32 },
  liberalArts: { label: '교양', required: 26, earned: 28 },
  requiredCourses: { label: '필수 교과목', required: 8, earned: 7 },
  certification: { label: '졸업인증', required: 1, earned: 0 },
};

export const completedCourses = [
  { id: 'jp101', name: '일본지역입문', area: '제1전공', credits: 3, completed: true },
  { id: 'jp220', name: '일본사회와문화', area: '제1전공', credits: 3, completed: true },
  { id: 'sw110', name: '프로그래밍기초', area: '제2전공', credits: 3, completed: true },
  { id: 'sw210', name: '자료구조', area: '제2전공', credits: 3, completed: true },
  { id: 'lib01', name: 'AI와 미래사회', area: '교양', credits: 2, completed: true },
  { id: 'need01', name: '융합일본지역 전공필수', area: '제1전공', credits: 2, completed: false },
  { id: 'need02', name: '데이터베이스', area: '제2전공', credits: 3, completed: false },
];

export const roadmapSeed = [
  {
    id: '2026-1',
    term: '2026년 1학기',
    goal: '전공필수와 데이터 분석 축을 먼저 채우기',
    courses: [
      { id: 'r1', name: '일본지역데이터분석', credits: 3, type: '전공선택', required: false },
      { id: 'r2', name: '소프트웨어공학', credits: 3, type: '전공선택', required: false },
      { id: 'r3', name: '데이터베이스', credits: 3, type: '전공필수', required: true },
      { id: 'r4', name: '전공세미나', credits: 3, type: '전공필수', required: true },
      { id: 'r5', name: '교양 선택', credits: 3, type: '교양', required: false },
    ],
    reason: '전공필수 과목을 우선 배치했고, 관심 분야인 데이터 분석과 연결되는 과목을 같은 학기에 묶었습니다.',
  },
  {
    id: 'summer',
    term: '2026년 여름학기',
    goal: '부족 학점을 가볍게 보강하기',
    courses: [{ id: 'r6', name: '온라인 교양', credits: 2, type: '교양', required: false }],
    reason: '정규학기 부담을 낮추기 위해 온라인 교양을 계절학기에 배치했습니다.',
  },
  {
    id: '2026-2',
    term: '2026년 2학기',
    goal: '졸업요건 최종 확인과 캡스톤 마무리',
    courses: [
      { id: 'r7', name: '캡스톤디자인', credits: 3, type: '전공필수', required: true },
      { id: 'r8', name: '융합일본지역 전공필수', credits: 2, type: '전공필수', required: true },
      { id: 'r9', name: '소프트웨어 전공선택', credits: 3, type: '전공선택', required: false },
      { id: 'r10', name: '졸업인증 준비', credits: 0, type: '인증', required: true },
    ],
    reason: '졸업 직전에는 인증과 필수 교과목을 함께 점검해야 해서 확인 필요 항목을 마지막 학기에 모았습니다.',
  },
  {
    id: 'grad',
    term: '졸업 예정',
    goal: '졸업신청과 최종 서류 제출',
    courses: [{ id: 'r11', name: '졸업신청', credits: 0, type: '행정', required: true }],
    reason: '총학점과 전공 요건을 채운 뒤 졸업신청 기간에 맞춰 행정 일정을 배치했습니다.',
  },
];

export const timetablePlans = {
  A: {
    title: 'Plan A',
    summary: '공강을 최대한 확보한 추천안',
    tags: ['월요일 공강', '오전 수업 최소화', '팀플 적음', '총 18학점'],
    courses: [
      { name: '일본지역데이터분석', room: '본관 302', day: '화', start: 13, end: 15, color: 'sky' },
      { name: '데이터베이스', room: '공학관 210', day: '수', start: 10, end: 12, color: 'indigo' },
      { name: '소프트웨어공학', room: '공학관 312', day: '목', start: 14, end: 16, color: 'green' },
      { name: '전공세미나', room: '어문관 405', day: '금', start: 11, end: 13, color: 'orange' },
      { name: '교양 선택', room: '온라인', day: '금', start: 15, end: 17, color: 'rose' },
    ],
  },
  B: {
    title: 'Plan B',
    summary: '전공필수를 우선한 안정적인 추천안',
    tags: ['전공필수 우선', '오전 수업 포함', '졸업요건 안정', '총 18학점'],
    courses: [
      { name: '데이터베이스', room: '공학관 210', day: '월', start: 9, end: 11, color: 'indigo' },
      { name: '캡스톤디자인', room: '공학관 501', day: '화', start: 10, end: 13, color: 'green' },
      { name: '일본지역데이터분석', room: '본관 302', day: '수', start: 13, end: 15, color: 'sky' },
      { name: '전공세미나', room: '어문관 405', day: '목', start: 15, end: 17, color: 'orange' },
      { name: '소프트웨어 전공선택', room: '공학관 220', day: '금', start: 10, end: 12, color: 'rose' },
    ],
  },
  C: {
    title: 'Plan C',
    summary: '인기 과목 실패 시 사용하는 대체안',
    tags: ['대체 과목 포함', '시간 충돌 없음', '제2전공 보강', '총 17학점'],
    courses: [
      { name: '빅데이터입문', room: '공학관 205', day: '화', start: 10, end: 12, color: 'indigo', replacement: true },
      { name: '소프트웨어공학', room: '공학관 312', day: '수', start: 14, end: 16, color: 'green' },
      { name: '일본비즈니스실습', room: '본관 210', day: '목', start: 13, end: 15, color: 'sky', replacement: true },
      { name: '전공세미나', room: '어문관 405', day: '금', start: 11, end: 13, color: 'orange' },
      { name: '온라인 교양', room: '온라인', day: '금', start: 16, end: 18, color: 'rose' },
    ],
  },
};

export const replacements = {
  데이터베이스: {
    failed: '데이터베이스',
    alternative: '빅데이터입문',
    reason: '졸업요건과 시간 충돌을 고려해 제2전공 전공선택으로 인정 가능한 대체 과목을 찾았습니다.',
    before: '수요일 10:00 데이터베이스',
    after: '화요일 10:00 빅데이터입문',
    targetPlan: 'C',
  },
  일본지역데이터분석: {
    failed: '일본지역데이터분석',
    alternative: '일본비즈니스실습',
    reason: '관심 분야인 일본 지역 비즈니스와 연결되고 제1전공 학점으로 인정되는 과목입니다.',
    before: '화요일 13:00 일본지역데이터분석',
    after: '목요일 13:00 일본비즈니스실습',
    targetPlan: 'C',
  },
};

export const calendarSeed = [
  { id: 'c1', date: '2026-07-15', title: '2학기 수강편람 공개', category: '수강신청' },
  { id: 'c2', date: '2026-07-22', title: '장바구니 신청', category: '수강신청' },
  { id: 'c3', date: '2026-08-04', title: '수강신청', category: '수강신청' },
  { id: 'c4', date: '2026-08-10', title: '수강신청 변경', category: '학사 일정' },
  { id: 'c5', date: '2026-09-20', title: '데이터베이스 과제 제출', category: '과제' },
  { id: 'c6', date: '2026-10-15', title: '중간고사 시작', category: '시험' },
  { id: 'c7', date: '2026-11-05', title: '캡스톤 팀플 중간 발표', category: '팀플' },
  { id: 'c8', date: '2026-12-01', title: '졸업신청 서류 확인', category: '졸업' },
];

export const aiKnowledge = [
  {
    q: '졸업하려면 어떤 과목을 더 들어야 해?',
    a: '현재 서린님은 총 108학점을 이수했고, 졸업까지 26학점이 남았습니다. 제1전공은 2학점, 제2전공은 10학점이 부족합니다. 다음 학기에는 융합일본지역전공 전공필수 1과목과 융복합소프트웨어전공 과목 3개를 우선 수강하는 것이 좋습니다.',
    sources: ['2026학년도 졸업요건', '융합일본지역전공 전공 교과과정', '융복합소프트웨어전공 수강편람'],
  },
  {
    q: '다음 학기 전공필수 과목을 추천해줘.',
    a: '다음 학기에는 데이터베이스, 전공세미나, 캡스톤디자인을 우선 추천합니다. 특히 데이터베이스는 제2전공 부족 학점을 채우면서 데이터 분석 관심 분야와도 직접 연결됩니다.',
    sources: ['융복합소프트웨어전공 수강편람', '2026학년도 졸업요건'],
  },
  {
    q: '교환학생 학점도 졸업학점에 포함돼?',
    a: '교환학생 학점은 학점인정 심사를 통과하면 졸업학점에 포함될 수 있습니다. 다만 전공, 교양, 일반선택 중 어느 영역으로 인정되는지는 학과 승인 결과를 확인해야 합니다.',
    sources: ['교환학생 학점인정 규정'],
  },
  {
    q: '데이터 분석과 관련된 과목을 추천해줘.',
    a: '서린님의 관심 분야를 기준으로 일본지역데이터분석, 데이터베이스, 빅데이터입문, 소프트웨어공학을 추천합니다. Plan A에서는 월요일 공강을 유지하면서 데이터 분석 과목을 화요일과 수요일에 배치했습니다.',
    sources: ['융합일본지역전공 전공 교과과정', '융복합소프트웨어전공 수강편람'],
  },
  {
    q: '수강신청에 실패하면 어떻게 해야 해?',
    a: 'Plan H는 실패 과목의 졸업요건, 시간 충돌, 대체 인정 가능성을 함께 확인합니다. 예를 들어 데이터베이스를 놓치면 빅데이터입문을 Plan C로 적용해 제2전공 학점을 보강할 수 있습니다.',
    sources: ['수강편람 대체 과목 목록', '2026학년도 졸업요건'],
  },
  {
    q: '이번 학기에 15학점만 들어도 졸업할 수 있어?',
    a: '15학점만 수강하면 총 123학점이 되어 졸업 필요 학점 134학점에는 아직 11학점이 부족합니다. 여름학기와 2학기까지 포함한 로드맵을 유지하면 졸업 가능성이 높습니다.',
    sources: ['2026학년도 졸업요건', '개인 이수 학점 현황'],
  },
];

export const sourceDocs = {
  '2026학년도 졸업요건': '총 134학점 이상, 전공별 최소 학점, 필수 교과목, 졸업인증을 모두 확인해야 합니다.',
  '융합일본지역전공 전공 교과과정': '일본 지역 이해와 데이터 기반 지역 분석 과목을 포함하며 전공필수 이수가 필요합니다.',
  '융복합소프트웨어전공 수강편람': '프로그래밍, 데이터베이스, 소프트웨어공학, 캡스톤 과목이 주요 이수 과목입니다.',
  '교환학생 학점인정 규정': '해외 이수 학점은 사전 승인과 귀국 후 심사를 통해 인정 영역이 결정됩니다.',
  '수강편람 대체 과목 목록': '폐강 또는 수강 실패 시 동일 영역 대체 과목을 학과 기준에 따라 선택할 수 있습니다.',
  '개인 이수 학점 현황': '현재 데모 학생은 108학점을 이수했고 졸업까지 26학점이 남아 있습니다.',
};
