"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

export type ModalKey =
  | null
  | "profil"
  | "streak"
  | "calendar"
  | "paywall"
  | "support"
  | "action"
  | "ricardo"
  | "addWater"
  | "addWeight";

export type Meal = {
  id: string;
  slot: "petit-dejeuner" | "dejeuner" | "diner" | "collation";
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
};

type State = {
  selectedDate: Date;
  water: number; // ml
  waterGoal: number;
  weight: number | null; // kg
  meals: Meal[];
  goals: { kcal: number; carbs: number; protein: number; fat: number };
  steps: number;
  stepsGoal: number;
  caloriesBurnedGoal: number;
  fastingStarted: boolean;
  fastingWindowMinutes: number; // eating window
  fastingElapsedMinutes: number;
  streak: number;
  weekDone: boolean[]; // 7 days
  liveActivity: boolean;
  homeWidget: boolean;
  profile: {
    sex: "Homme" | "Femme";
    age: number;
    height: number; // cm
    language: "Français" | "English";
    measurement: "Métrique" | "Impérial";
  };
};

const today = new Date();
const initialState: State = {
  selectedDate: today,
  water: 0,
  waterGoal: 2000,
  weight: null,
  meals: [],
  goals: { kcal: 1653, carbs: 145, protein: 165, fat: 46 },
  steps: 0,
  stepsGoal: 8728,
  caloriesBurnedGoal: 500,
  fastingStarted: false,
  fastingWindowMinutes: 12 * 60 + 12, // 12:12
  fastingElapsedMinutes: 0,
  streak: 0,
  weekDone: [true, true, true, true, false, true, false],
  liveActivity: true,
  homeWidget: false,
  profile: {
    sex: "Homme",
    age: 37,
    height: 175,
    language: "Français",
    measurement: "Métrique",
  },
};

type Action =
  | { type: "addWater"; ml: number }
  | { type: "resetWater" }
  | { type: "setWeight"; kg: number }
  | { type: "addMeal"; meal: Meal }
  | { type: "removeMeal"; id: string }
  | { type: "toggleLiveActivity" }
  | { type: "toggleHomeWidget" }
  | { type: "setDate"; date: Date }
  | { type: "startFasting" }
  | { type: "stopFasting" }
  | { type: "updateProfile"; patch: Partial<State["profile"]> }
  | { type: "addSteps"; n: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "addWater":
      return { ...state, water: Math.min(state.waterGoal, state.water + action.ml) };
    case "resetWater":
      return { ...state, water: 0 };
    case "setWeight":
      return { ...state, weight: action.kg };
    case "addMeal":
      return { ...state, meals: [...state.meals, action.meal] };
    case "removeMeal":
      return { ...state, meals: state.meals.filter((m) => m.id !== action.id) };
    case "toggleLiveActivity":
      return { ...state, liveActivity: !state.liveActivity };
    case "toggleHomeWidget":
      return { ...state, homeWidget: !state.homeWidget };
    case "setDate":
      return { ...state, selectedDate: action.date };
    case "startFasting":
      return { ...state, fastingStarted: true };
    case "stopFasting":
      return { ...state, fastingStarted: false, fastingElapsedMinutes: 0 };
    case "updateProfile":
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case "addSteps":
      return { ...state, steps: state.steps + action.n };
    default:
      return state;
  }
}

type Ctx = {
  state: State;
  dispatch: React.Dispatch<Action>;
  modal: ModalKey;
  openModal: (m: ModalKey) => void;
  closeModal: () => void;
};

const WelmiContext = createContext<Ctx | null>(null);

export function WelmiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modal, setModal] = useState<ModalKey>(null);

  const value = useMemo<Ctx>(
    () => ({
      state,
      dispatch,
      modal,
      openModal: (m) => setModal(m),
      closeModal: () => setModal(null),
    }),
    [state, modal]
  );

  return <WelmiContext.Provider value={value}>{children}</WelmiContext.Provider>;
}

export function useWelmi() {
  const ctx = useContext(WelmiContext);
  if (!ctx) throw new Error("useWelmi must be used within WelmiProvider");
  return ctx;
}

export const totals = (meals: Meal[]) =>
  meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      carbs: acc.carbs + m.carbs,
      protein: acc.protein + m.protein,
      fat: acc.fat + m.fat,
    }),
    { kcal: 0, carbs: 0, protein: 0, fat: 0 }
  );
