import { Info, RefreshCcw, Save, SlidersHorizontal, Star } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { replacements } from '../data/ssai/officialAppData';

const days = ['월', '화', '수', '목', '금'];
const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function Timetable({ plans, setPlans, activePlan, setActivePlan, setRoadmap, user }) {
  const [resultOpen, setResultOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [detail, setDetail] = useState(null);
  const [failed, setFailed] = useState('');
  const [statuses, setStatuses] = useState({});
  const [conditions, setConditions] = useState({
    freeDay: String(user?.freeDay || '금요일').replace('요일', ''),
    morning: !String(user?.preferredTime || '').includes('오후'),
    requiredFirst: true,
    lowTeamwork: String(user?.teamwork || '').includes('낮'),
    maxCredits: 18,
    allowConsecutive: true,
  });
  const plan = plans[activePlan];
  const replacement = replacements[failed];
  const totalCredits = plan.courses.reduce((sum, course) => sum + Number(course.credits || 3), 0);
  const unscheduledCourses = plan.courses.filter((course) => !course.day || !course.start || !course.end);

  const savePlan = () => {
    setPlans({
      ...plans,
      [activePlan]: {
        ...plan,
        tags: [
          `${conditions.freeDay}요일 공강 선호`,
          conditions.morning ? '오전 수업 허용' : '오후 수업 중심',
          conditions.requiredFirst ? '전공필수 우선' : '관심 과목 우선',
          `최대 ${conditions.maxCredits}학점`,
        ],
      },
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  const generatePlan = () => {
    const interest = String(user?.interests || '');
    const nextKey = interest.includes('미디어') || interest.includes('정책') ? 'C' : conditions.morning ? 'B' : 'A';
    setActivePlan(nextKey);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  const applyReplacement = () => {
    if (!replacement) return;
    const grade = Number(String(user?.grade || '2학년').replace(/[^0-9]/g, '')) || 2;
    const semesterNumber = String(user?.semester || '1학기').includes('2') ? 2 : 1;
    const currentTermId = `year${grade}-semester${semesterNumber}`;
    const updated = {
      ...plans,
      [replacement.targetPlan]: {
        ...plans[replacement.targetPlan],
        courses: plans[replacement.targetPlan].courses.map((course) =>
          course.name === replacement.alternative ? { ...course, replacement: true, status: '대체 추천' } : course,
        ),
      },
    };
    setPlans(updated);
    setActivePlan(replacement.targetPlan);
    setRoadmap((roadmap) =>
      roadmap.map((term) =>
        term.id === currentTermId
          ? {
              ...term,
              courses: [
                ...term.courses.filter((course) => course.name !== failed),
                { id: `replacement-${Date.now()}`, name: replacement.alternative, credits: 3, type: '전공선택', required: false },
              ],
            }
          : term,
      ),
    );
    setResultOpen(false);
    setFailed('');
  };

  return (
    <div className="pageStack">
      <div className="segmented">
        {Object.keys(plans).map((key) => (
          <button key={key} className={activePlan === key ? 'active' : ''} onClick={() => setActivePlan(key)}>
            Plan {key}
          </button>
        ))}
      </div>

      {!!unscheduledCourses.length && (
        <Card className="unscheduledCourses">
          <h3>시간 미정 후보</h3>
          {unscheduledCourses.map((course) => (
            <button key={course.id || course.name} onClick={() => setDetail(course)}>
              <span>{course.name}</span>
              <strong>{course.credits || 3}학점 · {course.area || course.type || '전공'}</strong>
            </button>
          ))}
        </Card>
      )}

      <Card>
        <p className="eyebrow">{plan.summary}</p>
        <div className="tagRow">
          {plan.tags.map((tag) => <span key={tag}>{tag}</span>)}
          <span>총 {totalCredits}학점</span>
        </div>
      </Card>

      <div className="timetableGrid">
        <div className="timeCorner" />
        {days.map((day) => <div className="dayHead" key={day}>{day}</div>)}
        {hours.map((hour) => (
          <div className="timeRow" key={hour}>
            <div className="hourLabel">{hour}:00</div>
            {days.map((day) => (
              <div className="timeCell" key={`${day}-${hour}`}>
                {plan.courses
                  .filter((course) => course.day === day && course.start === hour)
                  .map((course) => (
                    <button
                      key={course.name}
                      className={`classBlock ${course.color}`}
                      style={{ height: `${(course.end - course.start) * 54 - 6}px` }}
                      onClick={() => setDetail(course)}
                    >
                      <strong>{course.name}</strong>
                      <span>{course.room}</span>
                      <small>{course.start}:00-{course.end}:00</small>
                      {course.replacement && <em>대체</em>}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="buttonGrid">
        <Button variant="secondary" onClick={() => setConditionOpen(true)}><SlidersHorizontal size={16} /> 조건 수정</Button>
        <Button variant="secondary" onClick={generatePlan}><RefreshCcw size={16} /> 새로운 시간표 생성</Button>
        <Button onClick={() => setResultOpen(true)}>수강신청 결과 반영</Button>
        <Button variant="secondary" onClick={savePlan}><Save size={16} /> 시간표 저장</Button>
      </div>
      {saved && <p className="inlineToast">저장되었습니다.</p>}

      {conditionOpen && (
        <Modal title="시간표 조건 수정" onClose={() => setConditionOpen(false)}>
          <div className="settingsList">
            <label>공강 희망 요일<select value={conditions.freeDay} onChange={(event) => setConditions({ ...conditions, freeDay: event.target.value })}>{days.map((day) => <option key={day}>{day}</option>)}</select></label>
            <label>최대 신청 학점<input type="number" value={conditions.maxCredits} onChange={(event) => setConditions({ ...conditions, maxCredits: event.target.value })} /></label>
            {[
              ['morning', '오전 수업 최소화'],
              ['requiredFirst', '전공필수 우선'],
              ['lowTeamwork', '팀플 적은 과목 우선'],
              ['allowConsecutive', '연속 수업 허용'],
            ].map(([key, label]) => (
              <label className="switchRow" key={key}><input type="checkbox" checked={conditions[key]} onChange={(event) => setConditions({ ...conditions, [key]: event.target.checked })} />{label}</label>
            ))}
            <Button onClick={() => { setConditionOpen(false); generatePlan(); }}>조건 저장 후 재생성</Button>
          </div>
        </Modal>
      )}

      {resultOpen && (
        <Modal title="수강신청 결과 반영" onClose={() => setResultOpen(false)}>
          <div className="resultList">
            {plan.courses.map((course) => (
              <button key={course.name} className={failed === course.name ? 'failed' : ''} onClick={() => { setFailed(course.name); setStatuses({ ...statuses, [course.name]: '실패' }); }}>
                <span>{course.name}</span>
                <strong>{statuses[course.name] || '미확인'}</strong>
              </button>
            ))}
          </div>
          {failed && (
            <Card className="replacementCard">
              <h3>{failed} 수강신청에 실패했어요.</h3>
              {replacement ? (
                <>
                  <p>{replacement.reason}</p>
                  <div className="compareBox">
                    <span>변경 전: {replacement.before}</span>
                    <span>변경 후: {replacement.after}</span>
                  </div>
                  <strong>대체 과목: {replacement.alternative}</strong>
                  <Button onClick={applyReplacement}>
                    Plan {replacement.targetPlan}로 적용
                  </Button>
                  <Button variant="secondary" onClick={() => setFailed('')}>적용 취소</Button>
                </>
              ) : (
                <p>공식 분반·요일·시간 자료가 없어 대체 시간표를 확정할 수 없습니다.</p>
              )}
            </Card>
          )}
        </Modal>
      )}
      {detail && (
        <Modal title="과목 상세" onClose={() => setDetail(null)}>
          <Card>
            <h3>{detail.name}</h3>
            <p><Info size={14} /> {detail.day ? `${detail.day}요일 ${detail.start}:00-${detail.end}:00` : '시간 미정'} · {detail.room}</p>
            <p>학수번호: {detail.code || '공식 확인 필요'}</p>
            <p>교수명: {detail.professor || '미정'} · {detail.credits || 3}학점 · {detail.area || '전공'}</p>
            <p>{detail.status || '신청 전'} · 출처: {detail.source || '한국외대 강의시간표 조회'}</p>
            {detail.etaReview && (
              <div className="courseReviewBox">
                <strong><Star size={15} fill="currentColor" /> 에타 강의평 · {detail.etaReview.ratingLabel}</strong>
                {detail.etaReview.reviewCount != null && <span>강의평 {detail.etaReview.reviewCount}개</span>}
                <div>
                  {[detail.etaReview.assignment, detail.etaReview.teamProject, detail.etaReview.grading, detail.etaReview.attendance, detail.etaReview.exams].filter(Boolean).map((item) => <em key={item}>{item}</em>)}
                </div>
                <small>{detail.etaReview.source}</small>
              </div>
            )}
          </Card>
        </Modal>
      )}
    </div>
  );
}
