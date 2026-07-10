import { useEffect, useMemo, useState } from 'react';
import AppShell from './components/AppShell';
import CalendarPage from './pages/CalendarPage';
import Chat from './pages/Chat';
import GraduationDetail from './pages/GraduationDetail';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Roadmap from './pages/Roadmap';
import Timetable from './pages/Timetable';
import { calculateGraduation } from './utils/graduation';
import { loadState, resetState, saveState } from './utils/storage';

export default function App() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const metrics = useMemo(
    () => calculateGraduation(state.user, state.requirements, state.completedCourses, state.roadmap),
    [state.user, state.requirements, state.completedCourses, state.roadmap],
  );

  const patch = (partial) => setState((current) => ({ ...current, ...partial }));

  if (!state.onboarded) {
    return (
      <Onboarding
        user={state.user}
        setUser={(user) => patch({ user })}
        onStart={() => patch({ onboarded: true, activeTab: 'home' })}
      />
    );
  }

  const page = {
    home: (
      <Home
        user={state.user}
        metrics={metrics}
        completedCourses={state.completedCourses}
        setCompletedCourses={(completedCourses) => patch({ completedCourses })}
        setActiveTab={(activeTab) => patch({ activeTab })}
      />
    ),
    detail: <GraduationDetail metrics={metrics} setActiveTab={(activeTab) => patch({ activeTab })} />,
    roadmap: <Roadmap roadmap={state.roadmap} setRoadmap={(roadmap) => patch({ roadmap })} metrics={metrics} />,
    timetable: <Timetable plans={state.timetablePlans} activePlan={state.activePlan} setActivePlan={(activePlan) => patch({ activePlan })} />,
    calendar: <CalendarPage events={state.calendar} setEvents={(calendar) => patch({ calendar })} />,
    chat: <Chat chat={state.chat} setChat={(chat) => patch({ chat })} user={state.user} />,
  }[state.activeTab];

  return (
    <AppShell
      activeTab={state.activeTab}
      setActiveTab={(activeTab) => patch({ activeTab })}
      onReset={() => setState(resetState())}
    >
      {page}
    </AppShell>
  );
}
