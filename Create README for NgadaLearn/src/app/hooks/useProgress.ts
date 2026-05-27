import { useState, useCallback } from "react";

const KEY = "ngada_progress_v2";

interface ProgressState {
  completed: string[];   // IDs de lições completas
  lastOpened: string | null;
  totalMinutes: number;
  streak: number;
  lastStudyDate: string | null;
}

const DEFAULT: ProgressState = {
  completed: [],
  lastOpened: null,
  totalMinutes: 0,
  streak: 0,
  lastStudyDate: null,
};

function load(): ProgressState {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return DEFAULT;
  }
}

function save(s: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

function updateStreak(state: ProgressState): ProgressState {
  const today = new Date().toDateString();
  if (state.lastStudyDate === today) return state;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return {
    ...state,
    streak: state.lastStudyDate === yesterday ? state.streak + 1 : 1,
    lastStudyDate: today,
  };
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(load);

  const completeLesson = useCallback((id: string, durationMin: number) => {
    setState((prev) => {
      const withStreak = updateStreak(prev);
      const next: ProgressState = {
        ...withStreak,
        completed: prev.completed.includes(id) ? prev.completed : [...prev.completed, id],
        lastOpened: id,
        totalMinutes: prev.totalMinutes + durationMin,
      };
      save(next);
      return next;
    });
  }, []);

  const openLesson = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev, lastOpened: id };
      save(next);
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (id: string) => state.completed.includes(id),
    [state.completed]
  );

  return {
    completed: state.completed,
    totalCompleted: state.completed.length,
    totalMinutes: state.totalMinutes,
    streak: state.streak,
    lastOpened: state.lastOpened,
    completeLesson,
    openLesson,
    isCompleted,
  };
}
