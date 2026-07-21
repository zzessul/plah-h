export function calculateGraduation(user, requirements, completedCourses, roadmap) {
  const plannedCredits = roadmap
    .flatMap((term) => term.courses)
    .reduce((sum, course) => sum + Number(course.credits || 0), 0);
  const extraCompleted = completedCourses
    .filter((course) => course.completed && course.id.startsWith('need'))
    .reduce((sum, course) => sum + course.credits, 0);
  const baseCredits = Number(user.earnedCredits ?? 0);
  const earnedCredits = baseCredits + extraCompleted;
  const totalRequired = Number(requirements.totalCredits || user.totalCredits);
  const remainingCredits = Math.max(totalRequired - earnedCredits, 0);
  const progress = Math.min(Math.round((earnedCredits / totalRequired) * 100), 100);

  const userMajorCredits = Number(user.majorCompletedCredits || 0);
  const userGeneralCredits = Number(user.generalEducationCompletedCredits || 0);
  const userRequiredCourses = Number(user.requiredCourseCount || 0);
  const userCertification = user.languageCertification === '완료' ? 1 : 0;

  const newlyCompletedMajorCredits = completedCourses
    .filter((course) => course.completed && course.area === 'SSAI 전공')
    .reduce((sum, course) => sum + course.credits, 0);
  const primaryEarned = Math.max(Number(requirements.primaryMajor.earned || 0), userMajorCredits) + newlyCompletedMajorCredits;
  const secondEarned = requirements.secondMajor.earned;
  const requiredEarned = Math.max(Number(requirements.requiredCourses.earned || 0), userRequiredCourses) + completedCourses.filter((course) => course.completed && course.required).length;
  const liberalArtsEarned = Math.max(Number(requirements.liberalArts.earned || 0), userGeneralCredits) + completedCourses.filter((course) => course.completed && course.area === '교양').reduce((sum,course)=>sum+course.credits,0);
  const certificationEarned = Math.max(Number(requirements.certification.earned || 0), userCertification);

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
      earned: certificationEarned,
      required: requirements.certification.required,
      status: requirements.certification.required === 0 || certificationEarned >= 1 ? '충족' : '확인 필요',
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
  const normalized = question.replace(/\s/g, '');
  const found = knowledge.find((item) => {
    const itemQuestion = item.q.replace(/\s/g, '');
    return normalized.includes(itemQuestion.slice(0, 6)) || itemQuestion.includes(normalized);
  }) || knowledge.find((item) => {
    if (normalized.includes('전공필수') || normalized.includes('추천과목') || normalized.includes('다음학기')) return item.q.includes('전공필수');
    if (normalized.includes('데이터') || normalized.includes('분석')) return item.q.includes('데이터 분석');
    if (normalized.includes('졸업')) return item.q.includes('졸업');
    if (normalized.includes('교환')) return item.q.includes('교환학생');
    return false;
  });
  if (found) return found;
  return {
    q: question,
    a: `현재 ${user?.earnedCredits || 0}학점 이수로 저장되어 있어요. 졸업요건 질문은 전공학점, 교양, 전공필수 중 하나로 물어보면 바로 계산해드릴게요.`,
    sources: ['SSAI 공식 졸업요건', 'SSAI 공식 교육과정'],
  };
}
