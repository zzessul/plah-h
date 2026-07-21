import { useEffect, useMemo, useState } from 'react';
import AppShell from './components/AppShell';
import CalendarPage from './pages/CalendarPage';
import Chat from './pages/Chat';
import GraduationDetail from './pages/GraduationDetail';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Opportunities from './pages/Opportunities';
import Roadmap from './pages/Roadmap';
import Timetable from './pages/Timetable';
import Recommendations from './pages/Recommendations';
import MyPage from './pages/MyPage';
import { calculateGraduation } from './utils/graduation';
import { loadState, resetState, saveState } from './utils/storage';
import { getAppRequirements } from './data/ssai/officialAppData';

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

  const resetAll = () => setState(resetState());

  if (!state.onboarded) {
    return (
      <Onboarding
        user={state.user}
        onStart={(user) => patch({ user, requirements: getAppRequirements(user), onboarded: true, activeTab: 'home' })}
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
    opportunities: <Opportunities user={state.user} />,
    recommendations: (
      <Recommendations
        user={state.user}
        roadmap={state.roadmap}
        plans={state.timetablePlans}
        setPlans={(timetablePlans) => patch({ timetablePlans })}
        setActivePlan={(activePlan) => patch({ activePlan })}
        setActiveTab={(activeTab) => patch({ activeTab })}
      />
    ),
    profile: (
      <MyPage
        user={state.user}
        notifications={state.notifications}
        setNotifications={(notifications) =>
          setState((current) => ({
            ...current,
            notifications: typeof notifications === 'function' ? notifications(current.notifications) : notifications,
          }))
        }
        onEditProfile={() => patch({ onboarded: false })}
        onReset={resetAll}
        setActiveTab={(activeTab) => patch({ activeTab })}
      />
    ),
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
