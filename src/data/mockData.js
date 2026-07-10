export const ssaiGraduationRequirements = {
  departmentId: 'ssai',
  departmentName: 'Social Science & AI융합학부',
  university: '한국외국어대학교',
  campus: '서울캠퍼스',
  totalGraduationCredits: 134,
  requiredLiberalArtsCredits: 32,
  referenceSemester: '2025-1',
  completionTypes: [
    { id: 'single-major', name: '전공심화(단일전공)', ssaiCredits: 58, minorCredits: 0, liberalArtsCredits: 32, totalGraduationCredits: 134 },
    { id: 'major-with-minor', name: '전공심화 + 부전공', ssaiCredits: 58, minorCredits: 21, liberalArtsCredits: 32, totalGraduationCredits: 134 },
    { id: 'double-major', name: 'SSAI 이중전공', ssaiCredits: 42, primaryMajorCredits: 42, secondaryMajorCredits: 42, liberalArtsCredits: 32, totalGraduationCredits: 134 },
    { id: 'minor', name: 'SSAI 부전공', ssaiCredits: 21, primaryMajorCredits: 42, minorCredits: 21, liberalArtsCredits: 32, totalGraduationCredits: 134 },
  ],
  graduationDegree: {
    korean: 'AI융합학사',
    english: 'Bachelor of Arts in AI Convergence',
  },
};

export const demoUser = {
  name: '',
  studentId: '',
  school: '한국외국어대학교',
  admissionYear: '2024',
  grade: '2학년',
  semester: '1학기',
  primaryMajor: 'Social Science & AI융합학부',
  secondMajor: '전공심화(단일전공)',
  completionType: 'single-major',
  exchange: '없음',
  interests: '사회과학 데이터 분석, 정책 AI, 자연어 처리',
  preferredTime: '오후 수업',
  freeDay: '금요일',
  teamwork: '보통',
  onlinePreference: '보통',
  earnedCredits: 52,
  totalCredits: 134,
};

export const requirements = {
  totalCredits: 134,
  primaryMajor: { label: 'SSAI 전공', required: 58, earned: 27 },
  secondMajor: { label: '심화/연계', required: 0, earned: 0 },
  liberalArts: { label: '교양', required: 32, earned: 22 },
  requiredCourses: { label: '필수 교과목', required: 14, earned: 10 },
  certification: { label: '졸업인증', required: 1, earned: 0 },
};

export const completedCourses = [
  { id: 'ssai-101', name: '미네르바인문1', area: '교양', credits: 3, completed: true },
  { id: 'ssai-102', name: 'College English (L/S)', area: '교양', credits: 3, completed: true },
  { id: 'ssai-103', name: 'College English (R/W)', area: '교양', credits: 3, completed: true },
  { id: 'ssai-105', name: '인공지능기초수학', area: 'SSAI 전공', credits: 3, completed: true },
  { id: 'ssai-106', name: '기초프로그래밍(컴퓨팅사고)', area: 'SSAI 전공', credits: 3, completed: true },
  { id: 'ssai-107', name: '인공지능개론', area: 'SSAI 전공', credits: 3, completed: true },
  { id: 'ssai-204', name: '소셜 데이터 프로그래밍 기초1', area: 'SSAI 전공', credits: 3, completed: true },
  { id: 'ssai-205', name: '확률과통계', area: 'SSAI 전공', credits: 3, completed: true },
  { id: 'need01', name: '사회과학연구방법론1', area: 'SSAI 전공', credits: 3, completed: false },
  { id: 'need02', name: '기계학습', area: 'SSAI 전공', credits: 3, completed: false },
];

export const roadmapSeed = [
  {
    id: 'year2-semester1',
    term: '2학년 1학기',
    goal: 'SSAI 핵심 전공 진입과 데이터 분석 기초 완성',
    courses: [
      { id: 'ssai-302', name: '사회과학연구방법론1', credits: 3, type: '전공필수', required: true },
      { id: 'ssai-303', name: '기계학습', credits: 3, type: '전공필수', required: true },
      { id: 'ssai-304', name: '객체지향형프로그래밍', credits: 3, type: '전공필수', required: true },
      { id: 'ssai-305', name: '텍스트 기반 사회과학 데이터분석1', credits: 3, type: '전공필수', required: true },
      { id: 'ssai-301', name: 'HUFS Career Design', credits: 1, type: '교양·진로', required: true },
    ],
    reason: 'SSAI 학생 인터뷰에서 가장 많이 확인할 핵심 전공 진입 학기라서 필수 과목을 우선 배치했습니다.',
  },
  {
    id: 'year2-semester2',
    term: '2학년 2학기',
    goal: '네트워크, 시각화, 자료구조로 분석 역량 확장',
    courses: [
      { id: 'ssai-401', name: '사회과학 데이터의 자료구조', credits: 3, type: '전공필수', required: true },
      { id: 'ssai-402', name: '사회연결망 데이터 분석', credits: 3, type: '전공필수', required: true },
      { id: 'ssai-403', name: '사회과학과 빅데이터 시각화', credits: 3, type: '전공필수', required: true },
    ],
    reason: '사회과학 데이터를 구조화하고 분석 결과를 해석 가능한 형태로 보여주는 학기입니다.',
  },
  {
    id: 'year3-semester1',
    term: '3학년 1학기',
    goal: 'AI 심화 과목과 사회과학 응용 분야 선택',
    courses: [
      { id: 'ssai-501', name: '딥러닝 및 응용', credits: 3, type: '전공선택', required: false },
      { id: 'ssai-504', name: '데이터마이닝', credits: 3, type: '전공선택', required: false },
      { id: 'ssai-505', name: '시계열분석', credits: 3, type: '전공선택', required: false },
      { id: 'ssai-605', name: '관계형 데이터 분석', credits: 3, type: '전공심화', required: false },
    ],
    reason: '관심 분야가 데이터 분석이면 데이터마이닝, 시계열, 관계형 데이터 분석을 우선 추천합니다.',
  },
];

export const timetablePlans = {
  A: {
    title: 'Plan A',
    summary: 'SSAI 필수 과목을 지키면서 금요일 공강을 우선한 추천안',
    tags: ['금요일 공강', '전공필수 우선', '오후 수업 중심', '총 13학점'],
    courses: [
      { code: 'SSAI302', professor: '시연용 교수', name: '사회과학연구방법론1', room: '사회과학관 302', day: '월', start: 13, end: 15, credits: 3, area: '전공필수', color: 'indigo' },
      { code: 'SSAI303', professor: '시연용 교수', name: '기계학습', room: 'AI융합실습실', day: '화', start: 14, end: 16, credits: 3, area: '전공필수', color: 'sky' },
      { code: 'SSAI304', professor: '시연용 교수', name: '객체지향형프로그래밍', room: '공학관 210', day: '수', start: 10, end: 12, credits: 3, area: '전공필수', color: 'green' },
      { code: 'SSAI305', professor: '시연용 교수', name: '텍스트 기반 사회과학 데이터분석1', room: '사회과학관 405', day: '목', start: 15, end: 17, credits: 3, area: '전공필수', color: 'orange' },
      { code: 'HUFS301', professor: '시연용 교수', name: 'HUFS Career Design', room: '온라인', day: '월', start: 16, end: 17, credits: 1, area: '교양·진로', color: 'rose' },
    ],
  },
  B: {
    title: 'Plan B',
    summary: '오전 수업을 일부 허용하고 전공필수 안정성을 높인 추천안',
    tags: ['전공필수 우선', '오전 수업 포함', '시간 충돌 없음', '총 13학점'],
    courses: [
      { code: 'SSAI303', professor: '시연용 교수', name: '기계학습', room: 'AI융합실습실', day: '월', start: 9, end: 11, credits: 3, area: '전공필수', color: 'sky' },
      { code: 'SSAI302', professor: '시연용 교수', name: '사회과학연구방법론1', room: '사회과학관 302', day: '화', start: 10, end: 12, credits: 3, area: '전공필수', color: 'indigo' },
      { code: 'SSAI304', professor: '시연용 교수', name: '객체지향형프로그래밍', room: '공학관 210', day: '수', start: 13, end: 15, credits: 3, area: '전공필수', color: 'green' },
      { code: 'SSAI305', professor: '시연용 교수', name: '텍스트 기반 사회과학 데이터분석1', room: '사회과학관 405', day: '목', start: 13, end: 15, credits: 3, area: '전공필수', color: 'orange' },
      { code: 'HUFS301', professor: '시연용 교수', name: 'HUFS Career Design', room: '온라인', day: '금', start: 10, end: 11, credits: 1, area: '교양·진로', color: 'rose' },
    ],
  },
  C: {
    title: 'Plan C',
    summary: '인기 과목 실패 시 심화 선택 과목으로 대체하는 추천안',
    tags: ['대체 과목 포함', '데이터 분석 심화', '금요일 최소화', '총 12학점'],
    courses: [
      { code: 'SSAI401', professor: '시연용 교수', name: '사회과학 데이터의 자료구조', room: '사회과학관 310', day: '월', start: 13, end: 15, credits: 3, area: '전공필수', color: 'indigo', replacement: true },
      { code: 'SSAI402', professor: '시연용 교수', name: '사회연결망 데이터 분석', room: '사회과학관 407', day: '화', start: 15, end: 17, credits: 3, area: '전공필수', color: 'sky', replacement: true },
      { code: 'SSAI605', professor: '시연용 교수', name: '관계형 데이터 분석', room: 'AI융합실습실', day: '수', start: 10, end: 12, credits: 3, area: '전공심화', color: 'green' },
      { code: 'SSAI606', professor: '시연용 교수', name: '미디어 데이터 분석 실습', room: '미디어랩', day: '목', start: 14, end: 16, credits: 3, area: '전공심화', color: 'orange' },
    ],
  },
};

export const replacements = {
  기계학습: {
    failed: '기계학습',
    alternative: '사회과학 데이터의 자료구조',
    reason: '같은 SSAI 전공 핵심 영역이며 기존 시간표와 충돌하지 않는 대체 과목입니다.',
    before: '화요일 14:00 기계학습',
    after: '월요일 13:00 사회과학 데이터의 자료구조',
    targetPlan: 'C',
  },
  '텍스트 기반 사회과학 데이터분석1': {
    failed: '텍스트 기반 사회과학 데이터분석1',
    alternative: '사회연결망 데이터 분석',
    reason: '사회과학 데이터 분석 흐름을 유지하면서 수강 실패 리스크를 줄이는 대체안입니다.',
    before: '목요일 15:00 텍스트 기반 사회과학 데이터분석1',
    after: '화요일 15:00 사회연결망 데이터 분석',
    targetPlan: 'C',
  },
};

export const calendarSeed = [
  { id: 'c1', date: '2026-07-15', title: '2학기 수강편람 공개', category: '수강신청' },
  { id: 'c2', date: '2026-07-22', title: '장바구니 신청', category: '수강신청' },
  { id: 'c3', date: '2026-08-04', title: '수강신청', category: '수강신청' },
  { id: 'c4', date: '2026-08-10', title: '수강신청 변경', category: '학사 일정' },
  { id: 'c5', date: '2026-09-20', title: '기계학습 과제 제출', category: '과제' },
  { id: 'c6', date: '2026-10-15', title: '중간고사 시작', category: '시험' },
  { id: 'c7', date: '2026-11-05', title: '사회과학 데이터 분석 팀프로젝트 발표', category: '팀플' },
  { id: 'c8', date: '2026-12-01', title: '졸업요건 예비 점검', category: '졸업' },
];

export const aiKnowledge = [
  {
    q: '졸업하려면 어떤 과목을 더 들어야 해?',
    a: '현재 SSAI 기준으로 졸업까지 남은 학점과 전공필수 이수 여부를 함께 봐야 합니다. 사회과학연구방법론1, 기계학습, 객체지향형프로그래밍, 텍스트 기반 사회과학 데이터분석1을 우선 확인하세요.',
    sources: ['SSAI융합학부 졸업요건', 'SSAI 전공 교과과정'],
  },
  {
    q: '다음 학기 전공필수 과목을 추천해줘.',
    a: '다음 학기에는 사회과학연구방법론1, 기계학습, 객체지향형프로그래밍, 텍스트 기반 사회과학 데이터분석1을 우선 추천합니다.',
    sources: ['SSAI 전공 교과과정', '2026학년도 수강편람'],
  },
  {
    q: '교환학생 학점도 졸업학점에 포함돼?',
    a: '교환학생 학점은 학점인정 심사를 통과하면 졸업학점에 포함될 수 있습니다. SSAI 전공 또는 교양 인정 여부는 학부 승인 기준을 확인해야 합니다.',
    sources: ['교환학생 학점인정 규정'],
  },
  {
    q: '데이터 분석과 관련된 과목을 추천해줘.',
    a: 'SSAI 학생에게는 텍스트 기반 사회과학 데이터분석1, 사회연결망 데이터 분석, 사회과학과 빅데이터 시각화, 데이터마이닝, 관계형 데이터 분석을 추천합니다.',
    sources: ['SSAI 전공 교과과정'],
  },
  {
    q: '수강신청에 실패하면 어떻게 해야 해?',
    a: 'Plan H는 실패 과목과 같은 SSAI 전공 영역, 학점, 시간 충돌 여부를 확인해 Plan C 대체안을 제안합니다.',
    sources: ['2026학년도 수강편람', 'SSAI 대체 추천 규칙'],
  },
  {
    q: '이번 학기에 15학점만 들어도 졸업할 수 있어?',
    a: '현재 이수학점과 SSAI 전공필수 충족 여부에 따라 달라집니다. 총학점이 충분해도 SSAI 전공필수나 교양 32학점이 부족하면 졸업요건 확인이 필요합니다.',
    sources: ['SSAI융합학부 졸업요건', '개인 이수 학점 현황'],
  },
];

export const sourceDocs = {
  'SSAI융합학부 졸업요건': '2025-1 기준 Social Science & AI융합학부는 총 134학점, 교양 32학점 이상, 이수유형별 SSAI 전공 학점 충족을 확인해야 합니다.',
  'SSAI 전공 교과과정': '인공지능기초수학, 기초프로그래밍, 확률과통계, 사회과학연구방법론, 기계학습, 사회과학 데이터 분석 과목으로 이어지는 교육과정입니다.',
  '2026학년도 수강편람': '시연용 데이터이며 실제 개설 여부와 시간표는 학기별 수강편람 확인이 필요합니다.',
  '교환학생 학점인정 규정': '해외 이수 학점은 사전 승인과 귀국 후 심사를 통해 인정 영역이 결정됩니다.',
  'SSAI 대체 추천 규칙': '같은 전공 영역, 유사 학점, 시간 충돌 없음, 졸업요건 기여도를 기준으로 대체 과목을 추천합니다.',
  '개인 이수 학점 현황': '사용자가 온보딩에서 입력한 현재 이수 학점을 기준으로 계산합니다.',
};
