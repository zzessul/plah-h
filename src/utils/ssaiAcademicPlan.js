import courses from '../data/ssai/ssaiCourses.json';
import requirements from '../data/ssai/ssaiGraduationRequirements.json';
import requiredGroups from '../data/ssai/ssaiRequiredCourses.json';
import prerequisites from '../data/ssai/ssaiPrerequisites.json';
import equivalencies from '../data/ssai/ssaiCourseEquivalencies.json';
import academicRules from '../data/ssai/ssaiAcademicRules.json';
import recommendationRules from '../data/ssai/ssaiRecommendationRules.json';
import curriculum from '../data/ssai/ssaiCurriculum.json';

const inRange = (year, rule) => year >= rule.admissionYearFrom && (rule.admissionYearTo == null || year <= rule.admissionYearTo);
const normalizeType = (value = '') => value.replaceAll(' ', '');

export function findApplicableRequirement(student) {
  const type = normalizeType(student.completionType);
  return requirements.find((rule) => inRange(Number(student.admissionYear), rule) && normalizeType(rule.completionType) === type) || null;
}

export function calculateRemainingCredits(student, requirement = findApplicableRequirement(student)) {
  if (!requirement) return { total: null, major: null, generalEducation: null };
  return {
    total: Math.max(requirement.totalGraduationCredits - Number(student.totalCompletedCredits || 0), 0),
    major: Math.max((requirement.ssaiMajorCredits ?? requirement.primaryMajorCredits ?? 0) - Number(student.majorCompletedCredits || 0), 0),
    generalEducation: Math.max((requirement.generalEducationCredits ?? 0) - Number(student.generalEducationCompletedCredits || 0), 0),
  };
}

export function findMissingRequiredCourses(student, requirement = findApplicableRequirement(student)) {
  const completed = new Set([...(student.completedCourseIds || []), ...(student.transferredCourseIds || []), ...(student.exchangeCourseIds || [])]);
  const ids = new Set(requirement?.requiredCourseIds || []);
  requiredGroups.filter((group) => inRange(Number(student.admissionYear), group)).forEach((group) => group.requiredCourseIds.forEach((id) => ids.add(id)));
  return [...ids].filter((id) => !completed.has(id));
}

export function validatePrerequisites(student, candidateCourseIds = []) {
  const completed = new Set(student.completedCourseIds || []);
  return candidateCourseIds.map((courseId) => {
    const rule = prerequisites.find((item) => item.courseId === courseId);
    const missing = (rule?.prerequisiteCourseIds || []).filter((id) => !completed.has(id));
    return { courseId, valid: missing.length === 0, missingPrerequisiteCourseIds: missing, rule: rule || null };
  });
}

export function recommendNextSemesterCourses(student) {
  const completed = new Set(student.completedCourseIds || []);
  const nextSemester = Number(student.currentSemester) === 1 ? 2 : 1;
  const nextYear = Number(student.currentSemester) === 1 ? Number(student.currentYear) : Number(student.currentYear) + 1;
  const missing = new Set(findMissingRequiredCourses(student));
  return courses.filter((course) => !completed.has(course.id) && (!course.offeredSemester || course.offeredSemester.includes(nextSemester))).map((course) => {
    let priority = 100;
    const reasons = [];
    if (missing.has(course.id)) { priority -= 50; reasons.push('입학연도 및 이수유형 기준 필수과목입니다.'); }
    if (course.recommendedYear === nextYear && course.recommendedSemester === nextSemester) { priority -= 10; reasons.push('권장 학년 및 학기에 해당합니다.'); }
    if ((course.careerTags || []).some((tag) => (student.interests || []).includes(tag))) { priority -= 5; reasons.push('관심 분야와 관련된 과목입니다.'); }
    return { ...course, recommendationPriority: priority, recommendationReasons: reasons, sourceReferences: course.source ? [course.source] : [] };
  }).sort((a,b) => a.recommendationPriority - b.recommendationPriority);
}

export function generateEightSemesterRoadmap(student) {
  const completed = new Set(student.completedCourseIds || []);
  return curriculum.map((term) => ({ ...term, requiredCourseIds: term.requiredCourseIds.filter((id) => !completed.has(id)), recommendedCourseIds: term.recommendedCourseIds.filter((id) => !completed.has(id)) }));
}

export function generateAlternativeCourses(courseId, student = {}) {
  const completed = new Set(student.completedCourseIds || []);
  const links = equivalencies.filter((item) => item.sourceCourseId === courseId);
  return links.flatMap((link) => link.equivalentCourseIds).filter((id) => !completed.has(id)).map((id) => courses.find((course) => course.id === id)).filter(Boolean);
}

export function generateTimetablePlans(candidateSections = [], preferences = {}) {
  const max = academicRules.find((rule) => rule.id === 'max-regular-credits')?.value ?? 20;
  const valid = candidateSections.filter((section) => !(preferences.preferredDaysOff || []).includes(section.day));
  const plans = ['A','B','C'].map((name, offset) => {
    const selected = [];
    let credits = 0;
    for (const section of valid.slice(offset)) {
      const conflict = selected.some((item) => item.day === section.day && item.start < section.end && section.start < item.end);
      if (!conflict && credits + Number(section.credits || 0) <= max) { selected.push(section); credits += Number(section.credits || 0); }
    }
    return { name, courses:selected, credits, verificationRequired:candidateSections.length === 0 };
  });
  return plans;
}

export function estimateGraduationSemester(student, requirement = findApplicableRequirement(student)) {
  const remaining = calculateRemainingCredits(student, requirement).total;
  if (remaining == null) return null;
  const load = Math.max(1, Number(student.preferredCredits || 18));
  const terms = Math.ceil(remaining / load);
  let year = Number(student.currentYear); let semester = Number(student.currentSemester);
  for (let i=0;i<terms;i+=1) { if (semester === 1) semester = 2; else { semester = 1; year += 1; } }
  return { year, semester, termsRemaining:terms, warning:year > 4 ? '정규 8학기를 초과할 수 있습니다.' : null };
}

export function calculateGraduationProgress(student) {
  const requirement = findApplicableRequirement(student);
  const remaining = calculateRemainingCredits(student, requirement);
  const missingRequiredCourses = findMissingRequiredCourses(student, requirement);
  const warnings = [];
  if (!requirement) warnings.push('입학연도와 이수유형에 맞는 공식 졸업요건을 찾지 못했습니다.');
  if (requiredGroups.some((item) => item.verificationRequired)) warnings.push('SSAI 전공필수 목록은 별도 공식 자료 확인이 필요합니다.');
  const progress = requirement ? Math.min(100, Math.round((Number(student.totalCompletedCredits || 0) / requirement.totalGraduationCredits) * 100)) : null;
  return { graduationProgress:progress, requirement, missingRequirements:remaining, missingRequiredCourses, recommendedNextSemester:recommendNextSemesterCourses(student), roadmap:generateEightSemesterRoadmap(student), warnings, estimatedGraduationSemester:estimateGraduationSemester(student, requirement), dataConfidence:requirement?.confidence || 'low', sourceReferences:requirement?.source ? [requirement.source] : [], recommendationRules };
}

export { academicRules };
