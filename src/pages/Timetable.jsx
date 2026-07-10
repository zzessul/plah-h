import { RefreshCcw, Save, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { replacements } from '../data/mockData';

const days = ['월', '화', '수', '목', '금'];
const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function Timetable({ plans, activePlan, setActivePlan }) {
  const [resultOpen, setResultOpen] = useState(false);
  const [failed, setFailed] = useState('');
  const plan = plans[activePlan];
  const replacement = replacements[failed];

  return (
    <div className="pageStack">
      <div className="segmented">
        {Object.keys(plans).map((key) => (
          <button key={key} className={activePlan === key ? 'active' : ''} onClick={() => setActivePlan(key)}>
            Plan {key}
          </button>
        ))}
      </div>

      <Card>
        <p className="eyebrow">{plan.summary}</p>
        <div className="tagRow">
          {plan.tags.map((tag) => <span key={tag}>{tag}</span>)}
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
                    <div
                      key={course.name}
                      className={`classBlock ${course.color}`}
                      style={{ height: `${(course.end - course.start) * 54 - 6}px` }}
                    >
                      <strong>{course.name}</strong>
                      <span>{course.room}</span>
                      <small>{course.start}:00-{course.end}:00</small>
                      {course.replacement && <em>대체</em>}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="buttonGrid">
        <Button variant="secondary"><SlidersHorizontal size={16} /> 조건 수정</Button>
        <Button variant="secondary"><RefreshCcw size={16} /> 새로운 시간표 생성</Button>
        <Button onClick={() => setResultOpen(true)}>수강신청 결과 반영</Button>
        <Button variant="secondary"><Save size={16} /> 시간표 저장</Button>
      </div>

      {resultOpen && (
        <Modal title="수강신청 결과 반영" onClose={() => setResultOpen(false)}>
          <div className="resultList">
            {plan.courses.map((course) => (
              <button key={course.name} className={failed === course.name ? 'failed' : ''} onClick={() => setFailed(course.name)}>
                <span>{course.name}</span>
                <strong>{failed === course.name ? '실패' : '성공'}</strong>
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
                  <Button onClick={() => { setActivePlan(replacement.targetPlan); setResultOpen(false); }}>
                    Plan {replacement.targetPlan}로 적용
                  </Button>
                </>
              ) : (
                <p>현재 조건에서는 시간 충돌이 없는 Plan B를 우선 추천합니다.</p>
              )}
            </Card>
          )}
        </Modal>
      )}
    </div>
  );
}
