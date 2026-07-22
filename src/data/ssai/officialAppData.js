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
  interests:'사회과학 데이터 분석, 정책 AI, 자연어 처리', preferredTime:'오후 수업', freeDay:'금요일', teamwork:'보통', onlinePreference:'보통',
  earnedCredits:52, majorCompletedCredits:24, generalEducationCompletedCredits:26, requiredCourseCount:4, languageCertification:'미완료', totalCredits:134,
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

export const etaLectureReviews = {
  M04101101: { rating:null, ratingLabel:'강의평 없음', reviewCount:0, assignment:null, teamProject:null, grading:null, attendance:null, exams:null, source:'에브리타임 강의평 사용자 제공' },
  M04103201: { rating:4.54, ratingLabel:'평점 4.54', reviewCount:null, assignment:'과제 없음', teamProject:'조모임 없음', grading:'성적 보통', attendance:'전자출결', exams:'시험 2번', source:'에브리타임 강의평 사용자 제공' },
  M04110201: { rating:null, ratingLabel:'강의평 없음', reviewCount:0, assignment:null, teamProject:null, grading:null, attendance:null, exams:null, source:'에브리타임 강의평 사용자 제공' },
  M04113101: { rating:5.0, ratingLabel:'평점 5.0', reviewCount:1, assignment:null, teamProject:null, grading:null, attendance:null, exams:null, source:'에브리타임 강의평 사용자 제공' },
  M04111101: { rating:4.60, ratingLabel:'평점 4.60', reviewCount:null, assignment:'과제 보통', teamProject:'조모임 없음', grading:'성적 보통', attendance:'전자출결', exams:'시험 2번', source:'에브리타임 강의평 사용자 제공' },
  M04109101: { rating:4.13, ratingLabel:'평점 4.13', reviewCount:null, assignment:'과제 없음', teamProject:'조모임 없음', grading:'성적 보통', attendance:'직접호명', exams:'시험 2번', source:'에브리타임 강의평 사용자 제공' },
  M04123101: { rating:null, ratingLabel:'강의평 없음', reviewCount:0, assignment:null, teamProject:null, grading:null, attendance:null, exams:null, source:'에브리타임 강의평 사용자 제공' },
  M04112201: { rating:null, ratingLabel:'강의평 없음', reviewCount:0, assignment:null, teamProject:null, grading:null, attendance:null, exams:null, source:'에브리타임 강의평 사용자 제공' },
  M04121101: { rating:null, ratingLabel:'강의평 없음', reviewCount:0, assignment:null, teamProject:null, grading:null, attendance:null, exams:null, source:'에브리타임 강의평 사용자 제공' },
  M04122101: { rating:null, ratingLabel:'강의평 없음', reviewCount:0, assignment:null, teamProject:null, grading:null, attendance:null, exams:null, source:'에브리타임 강의평 사용자 제공' },
};

const withEtaReview = (course) => ({ ...course, etaReview: etaLectureReviews[course.courseCode] || null });
const secondSemesterCourses = ssai2026SecondSemesterSchedule.map(withEtaReview);
const scheduleMap = new Map(secondSemesterCourses.map((course) => [course.courseCode, course]));
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
    etaReview: course.etaReview,
  } : null;
};
const compact = (items) => items.filter(Boolean);

export const official2026SecondSemesterCourses = secondSemesterCourses;

export const timetablePlans = {
  A: {
    title: 'Plan A',
    summary: '공식 2026-2 SSAI 개설강좌 기반 · 전공필수와 데이터 분석 균형',
    tags: ['2026-2 공식 시간표', '전공필수 3과목', '화·목·금 중심'],
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
    tags: ['2026-2 공식 시간표', '금요일 15시 이후 비움', '강의실 일부 미정'],
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
    tags: ['2026-2 공식 시간표', '데이터베이스·클라우드', '프로젝트 포함'],
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

const academicEvent = (id, date, title, category = '학사일정', description = '') => ({
  id,
  date,
  title,
  category,
  startTime: '09:00',
  endTime: '10:00',
  description: description || '한국외국어대학교 2026학년도 대학 학사일정 기준입니다.',
  notify: true,
});

export const calendarSeed = [
  academicEvent('hufs-2026-03-01-semester-start', '2026-03-01', '삼일절·학기개시일', '학사일정'),
  academicEvent('hufs-2026-03-02-substitute', '2026-03-02', '2026학년도 제1학기 개강·대체휴업일', '학사일정'),
  academicEvent('hufs-2026-03-03-opening', '2026-03-03', '제1학기 개강', '학사일정'),
  academicEvent('hufs-2026-03-03-add-drop', '2026-03-03', '수강신청 변경 (03.03~03.09)', '수강신청', '제1학기 수강신청 변경 기간입니다.'),
  academicEvent('hufs-2026-03-24-withdraw', '2026-03-24', '수강신청 취소 (03.24~03.30)', '수강신청', '제1학기 수강신청 취소 기간입니다.'),
  academicEvent('hufs-2026-03-30-quarter', '2026-03-30', '제1학기 1/4선', '학사일정'),
  academicEvent('hufs-2026-04-20-anniversary', '2026-04-20', '제72주년 개교기념일', '학사일정'),
  academicEvent('hufs-2026-04-21-midterm', '2026-04-21', '제1학기 중간시험 (04.21~04.27)', '시험', '제1학기 중간시험 기간입니다.'),
  academicEvent('hufs-2026-04-27-half', '2026-04-27', '제1학기 2/4선', '학사일정'),
  academicEvent('hufs-2026-04-27-mid-grade', '2026-04-27', '제1학기 중간성적 입력 및 확인 (04.27~05.04)', '학사일정'),
  academicEvent('hufs-2026-05-01-labor', '2026-05-01', '노동절', '학사일정'),
  academicEvent('hufs-2026-05-05-childrens', '2026-05-05', '어린이날', '학사일정'),
  academicEvent('hufs-2026-05-24-buddha', '2026-05-24', '부처님오신날', '학사일정'),
  academicEvent('hufs-2026-05-25-substitute-three-quarter', '2026-05-25', '대체휴업일·제1학기 3/4선', '학사일정'),
  academicEvent('hufs-2026-06-03-election', '2026-06-03', '제9회 전국동시지방선거', '학사일정'),
  academicEvent('hufs-2026-06-06-memorial', '2026-06-06', '현충일', '학사일정'),
  academicEvent('hufs-2026-06-09-makeup', '2026-06-09', '제1학기 보강주간 (06.09~06.15)', '학사일정'),
  academicEvent('hufs-2026-06-15-grad-paper', '2026-06-15', '졸업시험 성적보고서 및 졸업논문 심사보고서 제출 마감', '졸업'),
  academicEvent('hufs-2026-06-16-final', '2026-06-16', '제1학기 기말시험 (06.16~06.22)', '시험', '제1학기 기말시험 기간입니다.'),
  academicEvent('hufs-2026-06-22-end', '2026-06-22', '제1학기 종강', '학사일정'),
  academicEvent('hufs-2026-06-22-grade-input', '2026-06-22', '제1학기 성적입력 (06.22~06.29)', '학사일정'),
  academicEvent('hufs-2026-06-23-summer', '2026-06-23', '하계방학 및 계절학기 개강', '학사일정'),
  academicEvent('hufs-2026-06-30-grade-check', '2026-06-30', '제1학기 성적 열람 및 정정 (06.30~07.06)', '학사일정'),
  academicEvent('hufs-2026-07-13-summer-end', '2026-07-13', '계절학기 종강', '학사일정'),
  academicEvent('hufs-2026-07-29-grad-review', '2026-07-29', '2026년 후기 졸업 사정회의', '졸업'),
  academicEvent('hufs-2026-08-03-leave-return', '2026-08-03', '제2학기 휴·복학 신청 (08.03~08.07)', '학사일정'),
  academicEvent('hufs-2026-08-03-pre-register', '2026-08-03', '사전수강신청', '수강신청'),
  academicEvent('hufs-2026-08-10-register', '2026-08-10', '수강신청 (08.10~08.14)', '수강신청', '2026학년도 제2학기 수강신청 기간입니다.'),
  academicEvent('hufs-2026-08-15-liberation', '2026-08-15', '광복절', '학사일정'),
  academicEvent('hufs-2026-08-17-substitute', '2026-08-17', '대체휴업일', '학사일정'),
  academicEvent('hufs-2026-08-21-graduation', '2026-08-21', '2026년 후기 학위수여식', '졸업'),
  academicEvent('hufs-2026-09-01-opening', '2026-09-01', '제2학기 학기개시일·개강', '학사일정'),
  academicEvent('hufs-2026-09-01-add-drop', '2026-09-01', '수강신청 변경 (09.01~09.07)', '수강신청', '제2학기 수강신청 변경 기간입니다.'),
  academicEvent('hufs-2026-09-22-withdraw', '2026-09-22', '수강신청 취소 (09.22~09.28)', '수강신청', '제2학기 수강신청 취소 기간입니다.'),
  academicEvent('hufs-2026-09-24-chuseok', '2026-09-24', '추석 (09.24~09.26)', '학사일정'),
  academicEvent('hufs-2026-09-28-quarter', '2026-09-28', '제2학기 1/4선', '학사일정'),
  academicEvent('hufs-2026-10-03-national', '2026-10-03', '개천절', '학사일정'),
  academicEvent('hufs-2026-10-05-substitute', '2026-10-05', '대체휴업일', '학사일정'),
  academicEvent('hufs-2026-10-09-hangul', '2026-10-09', '한글날', '학사일정'),
  academicEvent('hufs-2026-10-20-midterm', '2026-10-20', '제2학기 중간시험 (10.20~10.26)', '시험', '제2학기 중간시험 기간입니다.'),
  academicEvent('hufs-2026-10-26-half', '2026-10-26', '제2학기 2/4선', '학사일정'),
  academicEvent('hufs-2026-10-26-mid-grade', '2026-10-26', '제2학기 중간성적 입력 및 확인 (10.26~11.02)', '학사일정'),
  academicEvent('hufs-2026-11-23-three-quarter', '2026-11-23', '제2학기 3/4선', '학사일정'),
  academicEvent('hufs-2026-12-08-makeup', '2026-12-08', '제2학기 보강주간 (12.08~12.14)', '학사일정'),
  academicEvent('hufs-2026-12-14-grad-paper', '2026-12-14', '졸업시험 성적보고서 및 졸업논문 심사보고서 제출 마감', '졸업'),
  academicEvent('hufs-2026-12-15-final', '2026-12-15', '제2학기 기말시험 (12.15~12.21)', '시험', '제2학기 기말시험 기간입니다.'),
  academicEvent('hufs-2026-12-21-end', '2026-12-21', '제2학기 종강', '학사일정'),
  academicEvent('hufs-2026-12-21-grade-input', '2026-12-21', '제2학기 성적입력 (12.21~12.28)', '학사일정'),
  academicEvent('hufs-2026-12-22-winter', '2026-12-22', '동계방학 및 계절학기 개강', '학사일정'),
  academicEvent('hufs-2026-12-25-christmas', '2026-12-25', '성탄절', '학사일정'),
  academicEvent('hufs-2026-12-28-grade-check', '2026-12-28', '제2학기 성적 열람 및 정정 (12.28~01.04)', '학사일정'),
  academicEvent('hufs-2027-01-01-new-year', '2027-01-01', '신정', '학사일정'),
  academicEvent('hufs-2027-01-13-winter-end', '2027-01-13', '계절학기 종강', '학사일정'),
  academicEvent('hufs-2027-01-27-grad-review', '2027-01-27', '2027년 전기 졸업 사정회의', '졸업'),
  academicEvent('hufs-2027-01-28-pre-register-1', '2027-01-28', '사전수강신청 1차 (01.28~01.29)', '수강신청'),
  academicEvent('hufs-2027-02-01-leave-return', '2027-02-01', '2027학년도 제1학기 휴·복학신청 (02.01~02.05)', '학사일정'),
  academicEvent('hufs-2027-02-04-pre-register-2', '2027-02-04', '사전수강신청 2차', '수강신청'),
  academicEvent('hufs-2027-02-06-lunar', '2027-02-06', '설날 연휴 (02.06~02.08)', '학사일정'),
  academicEvent('hufs-2027-02-09-substitute', '2027-02-09', '대체휴업일', '학사일정'),
  academicEvent('hufs-2027-02-10-register-upper', '2027-02-10', '수강신청 2~4학년 (02.10~02.12)', '수강신청'),
  academicEvent('hufs-2027-02-19-graduation', '2027-02-19', '2027년 전기 학위수여식', '졸업'),
  academicEvent('hufs-2027-02-22-register-first', '2027-02-22', '수강신청 1학년·전체 (02.22~02.23)', '수강신청'),
];
export const aiKnowledge = [
  {q:'졸업하려면 어떤 과목을 더 들어야 해?',a:'졸업까지 남은 학점과 미충족 영역을 먼저 채우면 돼요.',sources:['SSAI 공식 졸업요건','SSAI 공식 교육과정']},
  {q:'다음 학기 전공필수 과목을 추천해줘.',a:'소셜데이터프로그래밍기초, 자료구조, 데이터베이스.',sources:['한국외대 2026-2 SSAI 강의시간표','SSAI 공식 교육과정']},
  {q:'교환학생 학점도 졸업학점에 포함돼?',a:'승인되면 포함돼요. 정규학기 최대 18학점, 재학 중 최대 35학점 기준이에요.',sources:['2026-1 서울캠퍼스 수강편람 PDF 103-104쪽']},
  {q:'데이터 분석과 관련된 과목을 추천해줘.',a:'사회과학과데이터사이언스, 산업데이터시각화, 데이터베이스.',sources:['한국외대 2026-2 SSAI 강의시간표','SSAI 공식 교육과정']},
];
export const sourceDocs = {
  'SSAI 공식 졸업요건':'https://ssai.hufs.ac.kr/ssai/10868/subview.do',
  'SSAI 공식 교육과정':'https://ssai.hufs.ac.kr/ssai/10867/subview.do',
  '한국외대 2026-2 SSAI 강의시간표':'https://wis.hufs.ac.kr/src08/jsp/lecture/LECTURE2020L.jsp',
  '2026-1 서울캠퍼스 수강편람 PDF 103-104쪽':'국내외 학점교류 규정',
};
export { graduationRequirements };
