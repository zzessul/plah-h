export function calculateGraduation(user, requirements, completedCourses, roadmap) {
  const plannedCredits = roadmap
    .flatMap((term) => term.courses)
    .reduce((sum, course) => sum + Number(course.credits || 0), 0);
  const extraCompleted = completedCourses
    .filter((course) => course.completed && course.id.startsWith('need'))
    .reduce((sum, course) => sum + course.credits, 0);
  const baseCredits = Number(user.earnedCredits || 108);
  const earnedCredits = baseCredits + extraCompleted;
  const totalRequired = Number(requirements.totalCredits || user.totalCredits);
  const remainingCredits = Math.max(totalRequired - earnedCredits, 0);
  const progress = Math.min(Math.round((earnedCredits / totalRequired) * 100), 100);

  const newlyCompletedMajorCredits = completedCourses
    .filter((course) => course.completed && course.area === 'SSAI 전공')
    .reduce((sum, course) => sum + course.credits, 0);
  const primaryEarned = requirements.primaryMajor.earned + newlyCompletedMajorCredits;
  const secondEarned = requirements.secondMajor.earned;
  const requiredEarned = requirements.requiredCourses.earned + completedCourses.filter((course) => course.completed && course.required).length;
  const liberalArtsEarned = requirements.liberalArts.earned + completedCourses.filter((course) => course.completed && course.area === '교양').reduce((sum,course)=>sum+course.credits,0);

  const areas = [
    {
      key: 'primaryMajor',
      label: '제1전공',
      earned: primaryEarned,
      required: requirements.primaryMajor.required,
      status: primaryEarned >= requirements.primaryMajor.required ? '충족' : '진행 중',
      detail: 'SSAI 전공필수, 공통계열기초, 전공심화 학점',
    },
    {
      key: 'secondMajor',
      label: '제2전공',
      earned: secondEarned,
      required: requirements.secondMajor.required,
      status: secondEarned >= requirements.secondMajor.required ? '충족' : '미충족',
      detail: requirements.secondMajor.required > 0 ? '이수유형에 따른 추가 전공 학점 확인 필요' : '전공심화 단일전공 기준에서는 별도 제2전공 학점이 필요하지 않습니다.',
    },
    {
      key: 'liberalArts',
      label: '교양',
      earned: liberalArtsEarned,
      required: requirements.liberalArts.required,
      status: liberalArtsEarned >= requirements.liberalArts.required ? '충족' : '진행 중',
      detail: '공식 교양 최소학점 기준',
    },
    {
      key: 'requiredCourses',
      label: '필수 교과목',
      earned: requiredEarned,
      required: requirements.requiredCourses.required,
      status: requiredEarned >= requirements.requiredCourses.required ? '충족' : '진행 중',
      detail: 'SSAI 공식 교육과정 전공필수 9과목',
    },
    {
      key: 'certification',
      label: requirements.certification.label || '외국어인증',
      earned: requirements.certification.earned,
      required: requirements.certification.required,
      status: requirements.certification.earned >= 1 ? '충족' : '확인 필요',
      detail: '2007학번 이후 외국어인증 또는 공식 면제·대체 요건 확인 필요',
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
