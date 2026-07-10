export function calculateGraduation(user, requirements, completedCourses, roadmap) {
  const plannedCredits = roadmap
    .flatMap((term) => term.courses)
    .reduce((sum, course) => sum + Number(course.credits || 0), 0);
  const extraCompleted = completedCourses
    .filter((course) => course.completed && course.id.startsWith('need'))
    .reduce((sum, course) => sum + course.credits, 0);
  const earnedCredits = 108 + extraCompleted;
  const totalRequired = requirements.totalCredits;
  const remainingCredits = Math.max(totalRequired - earnedCredits, 0);
  const progress = Math.min(Math.round((earnedCredits / totalRequired) * 100), 100);

  const primaryEarned = requirements.primaryMajor.earned + (completedCourses.find((c) => c.id === 'need01')?.completed ? 2 : 0);
  const secondEarned = requirements.secondMajor.earned + (completedCourses.find((c) => c.id === 'need02')?.completed ? 3 : 0);
  const requiredEarned = requirements.requiredCourses.earned + completedCourses.filter((c) => c.completed && c.id.startsWith('need')).length;

  const areas = [
    {
      key: 'primaryMajor',
      label: '제1전공',
      earned: primaryEarned,
      required: requirements.primaryMajor.required,
      status: primaryEarned >= requirements.primaryMajor.required ? '충족' : '진행 중',
      detail: '융합일본지역전공 필수/선택 학점',
    },
    {
      key: 'secondMajor',
      label: '제2전공',
      earned: secondEarned,
      required: requirements.secondMajor.required,
      status: secondEarned >= requirements.secondMajor.required ? '충족' : '미충족',
      detail: '전공선택 과목 3개 이상 추가 수강 필요',
    },
    {
      key: 'liberalArts',
      label: '교양',
      earned: requirements.liberalArts.earned,
      required: requirements.liberalArts.required,
      status: '충족',
      detail: '교양 필요 학점 초과 충족',
    },
    {
      key: 'requiredCourses',
      label: '필수 교과목',
      earned: requiredEarned,
      required: requirements.requiredCourses.required,
      status: requiredEarned >= requirements.requiredCourses.required ? '충족' : '진행 중',
      detail: '전공필수 1과목 확인 필요',
    },
    {
      key: 'certification',
      label: '졸업인증',
      earned: requirements.certification.earned,
      required: requirements.certification.required,
      status: requirements.certification.earned >= 1 ? '충족' : '확인 필요',
      detail: '외국어 인증 또는 대체 인증 제출 필요',
    },
  ];

  const blocked = areas.some((area) => ['미충족', '확인 필요'].includes(area.status));
  const roadmapCredits = roadmap
    .filter((term) => term.id !== 'grad')
    .flatMap((term) => term.courses)
    .reduce((sum, course) => sum + Number(course.credits || 0), 0);
  const canGraduateWithPlan = earnedCredits + roadmapCredits >= totalRequired && !blocked && plannedCredits >= remainingCredits;

  return {
    earnedCredits,
    totalRequired,
    remainingCredits,
    progress,
    areas,
    status: blocked ? '졸업요건 확인 필요' : canGraduateWithPlan ? '예상 졸업 가능' : '추가 수강 필요',
    canGraduateWithPlan,
  };
}

export function termCredits(term) {
  return term.courses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
}

export function getAiAnswer(question, knowledge, user) {
  const found = knowledge.find((item) => question.includes(item.q.slice(0, 8)) || item.q.includes(question));
  if (found) return found;
  return {
    q: question,
    a: `${user.name}님 기준으로 보면 현재 이수 학점과 전공별 부족 학점을 함께 확인해야 합니다. 졸업까지 남은 26학점을 제1전공, 제2전공, 졸업인증 순서로 점검하는 계획을 추천합니다.`,
    sources: ['2026학년도 졸업요건', '개인 이수 학점 현황'],
  };
}
