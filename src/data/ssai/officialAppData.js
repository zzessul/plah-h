import courses from './ssaiCourses.json';
import curriculum from './ssaiCurriculum.json';
import graduationRequirements from './ssaiGraduationRequirements.json';
import equivalencies from './ssaiCourseEquivalencies.json';
import ssai2026SecondSemesterSchedule from './ssai2026SecondSemesterSchedule.json';

const courseMap = new Map(courses.map((course) => [course.id, course]));
const appCourse = (id, required = false) => {
  const item = courseMap.get(id);
  return item ? { id:item.id, name:item.courseName, category:item.category, type:item.category, area:item.isGeneralEducation ? '교양' : 'SSAI 전공', credits:item.credits, required:required || item.isRequired, completed:false, included:true, reason:item.isRequired ? 'SSAI 공식 교육과정에서 필수 영역으로 분류된 과목입니다.' : 'SSAI 공식 교육과정에 제시된 과목입니다.', source:item.source } : null;
};

export const demoUser = {
  name:'', studentId:'2024학번', school:'한국외국어대학교', admissionYear:'2024', grade:'2학년', semester:'1학기',
  primaryMajor:'Social Science & AI융합학부', secondMajor:'전공심화(단일전공)', completionType:'single-major', exchange:'없음',
  interests:'사회과학 데이터 분석, 정책 AI, 자연어 처리', preferredTime:'오후 수업', freeDay:'금요일', teamwork:'보통', onlinePreference:'보통', earnedCredits:52, totalCredits:134,
};

export const requirements = {
  totalCredits:134,
  primaryMajor:{label:'SSAI 전공',required:58,earned:0},
  secondMajor:{label:'심화/연계',required:0,earned:0},
  liberalArts:{label:'교양',required:32,earned:0},
  requiredCourses:{label:'전공필수 교과목',required:courses.filter((course)=>course.isMajorRequired&&course.department==='Social Science & AI융합학부').length,earned:0},
  certification:{label:'외국어인증',required:1,earned:0},
};

const completionTypeByApp = {
  'single-major':'SSAI 전공심화(단일전공)',
  'major-with-minor':'SSAI 전공심화 + 부전공',
  'double-major':'SSAI 제1전공 + 이중전공',
  minor:'SSAI 제1전공 + 부전공',
};

export function getAppRequirements(user) {
  const year = Number(user?.admissionYear || 2024);
  const type = completionTypeByApp[user?.completionType] || completionTypeByApp['single-major'];
  const rule = graduationRequirements.find((item)=>year>=item.admissionYearFrom&&(item.admissionYearTo==null||year<=item.admissionYearTo)&&item.completionType===type);
  if (!rule) return requirements;
  return {
    totalCredits:rule.totalGraduationCredits,
    primaryMajor:{label:'SSAI 전공',required:rule.ssaiMajorCredits,earned:0},
    secondMajor:{label:user?.completionType==='major-with-minor'?'부전공':'이중전공/추가전공',required:rule.minorCredits||rule.doubleMajorCredits||0,earned:0},
    liberalArts:{label:'교양',required:rule.generalEducationCredits,earned:0},
    requiredCourses:{label:'전공필수 교과목',required:courses.filter((course)=>course.isMajorRequired&&course.department==='Social Science & AI융합학부').length,earned:0},
    certification:{label:'외국어인증',required:rule.languageCertificationRequired?1:0,earned:0},
  };
}

export const completedCourses = courses.filter((course)=>course.department==='Social Science & AI융합학부').map((course)=>({id:course.id,name:course.courseName,area:course.isGeneralEducation?'교양':'SSAI 전공',credits:course.credits,required:course.isMajorRequired,completed:false,source:course.source}));

export const roadmapData = curriculum.map((term,index)=>({
  ...term, order:index+1, status:index<2?'completed':index===2?'current':term.verificationRequired?'attention':'planned', completedCredits:0,
  cumulativeCredits:curriculum.slice(0,index+1).reduce((sum,item)=>sum+Number(item.recommendedCredits||0),0), summary:term.verificationRequired?'공식 학기 배치 확인 필요':'SSAI 공식 교육과정',
  goal:term.verificationRequired?'고학년 통합 목록에서 과목을 선택합니다.':'공식 권장 학기의 필수·선택 과목을 이수합니다.', impact:'공식 SSAI 교육과정과 졸업요건에 반영됩니다.',
  courses:term.recommendedCourseIds.map((id)=>appCourse(id,term.requiredCourseIds.includes(id))).filter(Boolean), aiReason:term.verificationRequired?'공식 홈페이지가 3-2·4-1·4-2를 통합 제시하므로 개별 학기 배치를 확정하지 않습니다.':'SSAI 공식 홈페이지에 제시된 권장 학기입니다.',
}));

export const roadmapSeed = roadmapData.filter((term)=>term.order>=3).slice(0,3).map((term)=>({id:term.id,term:term.label,goal:term.goal,courses:term.courses,reason:term.aiReason}));

const scheduleMap = new Map(ssai2026SecondSemesterSchedule.map((course) => [course.courseCode, course]));
const planCourse = (courseCode, color) => {
  const course = scheduleMap.get(courseCode);
  return course ? {
    id: course.id,
    code: course.courseCode,
    professor: course.professor,
    professorEnglish: course.professorEnglish,
    name: course.courseName,
    englishName: course.englishName,
    room: course.room === '미정' ? '강의실 미정' : course.room,
    day: course.day,
    start: course.start,
    end: course.end,
    periods: course.periods,
    credits: course.credits,
    area: course.isRequired ? '전공필수' : '전공선택',
    color,
    status: course.syllabusAvailable ? '강의계획서 공개' : '강의계획서 미공개',
    source: course.source,
  } : null;
};
const compact = (items) => items.filter(Boolean);

export const official2026SecondSemesterCourses = ssai2026SecondSemesterSchedule;

export const timetablePlans = {
  A: {
    title: 'Plan A',
    summary: '공식 2026-2 SSAI 개설강좌 기반 · 전공필수와 데이터 분석 균형',
    tags: ['2026-2 공식 시간표', '전공필수 3과목', '총 15학점', '화·목·금 중심'],
    courses: compact([
      planCourse('M04101101', 'sky'),
      planCourse('M04121101', 'indigo'),
      planCourse('M04111101', 'green'),
      planCourse('M04103201', 'orange'),
      planCourse('M04109101', 'rose'),
    ]),
    verificationRequired: false,
  },
  B: {
    title: 'Plan B',
    summary: '공식 2026-2 SSAI 개설강좌 기반 · 오전/이른 오후 중심',
    tags: ['2026-2 공식 시간표', '금요일 15시 이후 비움', '총 15학점', '강의실 일부 미정'],
    courses: compact([
      planCourse('M04101101', 'sky'),
      planCourse('M04121101', 'indigo'),
      planCourse('M04113101', 'green'),
      planCourse('M04111101', 'orange'),
      planCourse('M04123101', 'rose'),
    ]),
    verificationRequired: false,
  },
  C: {
    title: 'Plan C',
    summary: '공식 2026-2 SSAI 개설강좌 기반 · 데이터 인프라/프로젝트 심화',
    tags: ['2026-2 공식 시간표', '데이터베이스·클라우드', '프로젝트 포함', '총 15학점'],
    courses: compact([
      planCourse('M04121101', 'indigo'),
      planCourse('M04122101', 'sky'),
      planCourse('M04112201', 'green'),
      planCourse('M04123101', 'orange'),
      planCourse('M04109101', 'rose'),
    ]),
    verificationRequired: false,
  },
};

export const replacements = Object.fromEntries(equivalencies.map((item)=>{const from=courseMap.get(item.sourceCourseId);const to=courseMap.get(item.equivalentCourseIds[0]);return from&&to?[from.courseName,{failed:from.courseName,alternative:to.courseName,reason:item.note,before:from.courseName,after:to.courseName,targetPlan:'C',source:item.source}]:null;}).filter(Boolean));

export const calendarSeed = [];
export const aiKnowledge = [
  {q:'졸업하려면 어떤 과목을 더 들어야 해?',a:'입학연도별 총학점·전공·교양 기준과 공식 전공필수 9과목의 이수 여부를 함께 확인해야 합니다.',sources:['SSAI 공식 졸업요건','SSAI 공식 교육과정']},
  {q:'다음 학기 전공필수 과목을 추천해줘.',a:'2026-2 공식 시간표 기준 전공필수로 소셜데이터프로그래밍기초, 자료구조, 데이터베이스가 개설되어 있습니다. 현재 이수 여부와 시간 충돌을 먼저 확인하세요.',sources:['한국외대 2026-2 SSAI 강의시간표','SSAI 공식 교육과정']},
  {q:'교환학생 학점도 졸업학점에 포함돼?',a:'국외대학 교류학점은 승인 절차를 거쳐 인정되며 정규학기 최대 18학점, 재학 중 전체 인정학점은 최대 35학점입니다.',sources:['2026-1 서울캠퍼스 수강편람 PDF 103-104쪽']},
  {q:'데이터 분석과 관련된 과목을 추천해줘.',a:'2026-2 개설강좌 중 사회과학과데이터사이언스, 산업데이터시각화, 데이터베이스를 우선 추천합니다. 심화 관심이면 클라우드컴퓨팅과 기술개발연구프로젝트도 함께 볼 수 있어요.',sources:['한국외대 2026-2 SSAI 강의시간표','SSAI 공식 교육과정']},
];
export const sourceDocs = {
  'SSAI 공식 졸업요건':'https://ssai.hufs.ac.kr/ssai/10868/subview.do',
  'SSAI 공식 교육과정':'https://ssai.hufs.ac.kr/ssai/10867/subview.do',
  '한국외대 2026-2 SSAI 강의시간표':'https://wis.hufs.ac.kr/src08/jsp/lecture/LECTURE2020L.jsp',
  '2026-1 서울캠퍼스 수강편람 PDF 103-104쪽':'국내외 학점교류 규정',
};
export { graduationRequirements };
