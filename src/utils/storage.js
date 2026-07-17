import { aiKnowledge, calendarSeed, completedCourses, demoUser, requirements, roadmapSeed, timetablePlans } from '../data/ssai/officialAppData';
import { calculateGraduationProgress } from './ssaiAcademicPlan';

export const STORAGE_KEY = 'plan-h-official-state-ssai-v3';

export function createInitialState() {
  return {
    onboarded: false,
    activeTab: 'home',
    user: demoUser,
    requirements,
    completedCourses,
    roadmap: roadmapSeed,
    timetablePlans,
    activePlan: 'A',
    calendar: calendarSeed,
    chat: [
      {
        role: 'assistant',
        text: '안녕하세요. Plan H예요. 졸업요건, 시간표 대안, 다음 학기 계획을 같이 점검해드릴게요.',
        sources: [],
      },
    ],
    aiKnowledge,
    officialSsaiPlan: calculateGraduationProgress({
      admissionYear: Number(demoUser.admissionYear),
      currentYear: 2,
      currentSemester: 1,
      completionType: 'SSAI 전공심화(단일전공)',
      completedCourseIds: completedCourses.filter((course) => course.completed).map((course) => course.id),
      totalCompletedCredits: demoUser.earnedCredits,
      majorCompletedCredits: requirements.primaryMajor.earned,
      generalEducationCompletedCredits: requirements.liberalArts.earned,
      preferredCredits: 18,
      interests: [],
    }),
  };
}

function mergeState(base, saved) {
  return {
    ...base,
    ...saved,
    user: { ...base.user, ...(saved.user || {}) },
    requirements: { ...base.requirements, ...(saved.requirements || {}) },
    timetablePlans: { ...base.timetablePlans, ...(saved.timetablePlans || {}) },
    completedCourses: Array.isArray(saved.completedCourses) ? saved.completedCourses : base.completedCourses,
    roadmap: Array.isArray(saved.roadmap) ? saved.roadmap : base.roadmap,
    calendar: Array.isArray(saved.calendar) ? saved.calendar : base.calendar,
    chat: Array.isArray(saved.chat) ? saved.chat : base.chat,
  };
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? mergeState(createInitialState(), JSON.parse(saved)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 시연 중 저장 실패가 앱 전체를 멈추지 않도록 방어합니다.
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return createInitialState();
}
