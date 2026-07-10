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
  const setRoadmapState = (roadmap) =>
    setState((current) => ({
      ...current,
      roadmap: typeof roadmap === 'function' ? roadmap(current.roadmap) : roadmap,
    }));

  const resetAll = () => setState({ ...resetState(), onboarded: true, activeTab: 'home' });

  if (!state.onboarded) {
    return (
      <Onboarding
        user={state.user}
        onStart={(user) => patch({ user, onboarded: true, activeTab: 'home' })}
      />
    );
  }

  const page = {
    home: (
      <Home
        metrics={metrics}
        user={state.user}
        completedCourses={state.completedCourses}
        setCompletedCourses={(completedCourses) => patch({ completedCourses })}
        setActiveTab={(activeTab) => patch({ activeTab })}
        events={state.calendar}
      />
    ),
    detail: <GraduationDetail metrics={metrics} setActiveTab={(activeTab) => patch({ activeTab })} />,
    roadmap: (
      <Roadmap
        roadmap={state.roadmap}
        setRoadmap={setRoadmapState}
        metrics={metrics}
        user={state.user}
        completedCourses={state.completedCourses}
        setCompletedCourses={(completedCourses) => patch({ completedCourses })}
      />
    ),
    timetable: (
      <Timetable
        plans={state.timetablePlans}
        setPlans={(timetablePlans) => patch({ timetablePlans })}
        user={state.user}
        activePlan={state.activePlan}
        setActivePlan={(activePlan) => patch({ activePlan })}
        setRoadmap={setRoadmapState}
      />
    ),
    calendar: <CalendarPage events={state.calendar} setEvents={(calendar) => patch({ calendar })} />,
    chat: <Chat chat={state.chat} setChat={(chat) => patch({ chat })} user={state.user} metrics={metrics} events={state.calendar} />,
  }[state.activeTab];

  return (
    <AppShell
      activeTab={state.activeTab}
      setActiveTab={(activeTab) => patch({ activeTab })}
      onReset={resetAll}
      onEditProfile={() => patch({ onboarded: false })}
    >
      {page}
    </AppShell>
  );
}
