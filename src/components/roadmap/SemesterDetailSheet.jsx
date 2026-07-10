import { X } from 'lucide-react';

const categories = ['전공필수', '전공선택', '제2전공 기초', '교양', '인증', '졸업'];

export default function SemesterDetailSheet({
  semester,
  statusLabel,
  metrics,
  actualCredits,
  graduationReady,
  onClose,
  onToggleComplete,
  onToggleIncluded,
}) {
  const includedCourses = semester.courses.filter((course) => course.included !== false);
  const requiredMissing = semester.courses.filter((course) => course.required && course.included === false);

  return (
    <div className="roadmapSheetBackdrop" role="presentation" onClick={onClose}>
      <section className="roadmapDetailSheet" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="sheetHandle" />
        <header className="sheetTop">
          <div>
            <p className="eyebrow">{statusLabel}</p>
            <h3>{semester.label}</h3>
            <span>추천 {semester.recommendedCredits}학점 · 예상 누적 {semester.cumulativeCredits}학점</span>
          </div>
          <button className="iconButton" onClick={onClose} aria-label="상세 패널 닫기">
            <X size={18} />
          </button>
        </header>

        <div className="requirementSnapshot">
          <span>제1전공: 40 / 42학점</span>
          <span>제2전공: {actualCredits > 108 ? 35 : 32} / 42학점</span>
          <span>교양: 충족</span>
          <span>졸업인증: 준비 중</span>
        </div>

        <div className="sheetInfoGrid">
          <div>
            <span>핵심 목표</span>
            <strong>{semester.goal}</strong>
          </div>
          <div>
            <span>졸업 영향</span>
            <strong>{semester.impact}</strong>
          </div>
        </div>

        <section className="categorySummary" aria-label="과목 구분 요약">
          {categories.map((category) => {
            const count = includedCourses.filter((course) => course.category === category).length;
            return count ? <span key={category}>{category} {count}</span> : null;
          })}
        </section>

        <section className="sheetSection">
          <h4>추천 과목</h4>
          <div className="detailCourseList">
            {semester.courses.map((course) => (
              <article key={course.id} className={`detailCourse ${course.included === false ? 'excluded' : ''}`}>
                <label className="detailCourseCheck">
                  <input
                    type="checkbox"
                    checked={course.completed}
                    disabled={course.included === false}
                    onChange={(event) => onToggleComplete(course.id, event.target.checked)}
                  />
                  <span>{course.completed ? '완료' : '미완료'}</span>
                </label>
                <div className="detailCourseBody">
                  <h5>{course.name}</h5>
                  <p>{course.reason}</p>
                  <div>
                    <span>{course.category}</span>
                    <span>{course.credits}학점</span>
                    {course.required && <span className="requiredMark">필수</span>}
                  </div>
                </div>
                {semester.id === 'year4-semester2' && course.required && (
                  <button className="includeToggle" onClick={() => onToggleIncluded(course.id, course.included === false)}>
                    {course.included === false ? '다시 포함' : '계획 제외'}
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="aiReasonBox">
          <h4>AI 추천 이유</h4>
          <p>{semester.aiReason}</p>
          {requiredMissing.length > 0 && <strong>주의: 4학년 2학기의 필수과목이 계획에서 제외되어 졸업요건 확인이 필요합니다.</strong>}
          <span>현재 반영 학점 {actualCredits} / {metrics.totalRequired}학점 · {graduationReady ? '졸업 가능 흐름' : '요건 확인 필요'}</span>
        </section>
      </section>
    </div>
  );
}
