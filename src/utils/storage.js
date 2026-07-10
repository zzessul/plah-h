import { aiKnowledge, calendarSeed, completedCourses, demoUser, requirements, roadmapSeed, timetablePlans } from '../data/mockData';

export const STORAGE_KEY = 'plan-h-demo-state';

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
  };
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return createInitialState();
}
