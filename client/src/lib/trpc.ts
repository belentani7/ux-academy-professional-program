/**
 * Cliente tRPC offline.
 *
 * La versión publicada de UX Academy es estática (sin servidor), así que
 * cualquier procedimiento tRPC (`trpc.x.y.useQuery`, `useMutation`,
 * `useUtils`, …) se resuelve aquí con respuestas vacías y seguras.
 * Así la app funciona en modo invitado en lugar de romperse con
 * "trpc.useUtils is not a function".
 *
 * Los tipos describen lo que el resto de la app consume realmente. Sin ellos
 * `trpc` era `any` y cada callback perdía el tipo de su parámetro (TS7006).
 */

import type { Locale } from "@shared/courseContent";

export type QuizScore = { correct: number; total: number };

export type QuizOutcome = { score: number; passed: boolean; correct: boolean[] };

export type ProjectSubmission = {
  projectId: string;
  status: string;
  summary?: string;
  reflection?: string;
  score?: number;
  feedback?: string;
  updatedAt?: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
  createdAt?: string;
};

/**
 * Todos los campos son opcionales porque este objeto se combina con el usuario
 * de `useAuth` en una unión; así el acceso a cualquier campo sigue siendo válido.
 */
export type Profile = {
  id?: number;
  openId?: string;
  name?: string;
  email?: string | null;
  loginMethod?: string;
  role?: string;
  totalPoints?: number;
  locale?: Locale;
  createdAt?: Date;
  updatedAt?: Date;
  lastSignedIn?: Date;
};

export type EvidenceItem = {
  id: string;
  kind: string;
  label: string;
  url?: string;
  externalUrl?: string;
  storageUrl?: string;
};

export type ModuleProgressEntry = {
  moduleId: string;
  percentage: number;
  completed: number;
};

export type PracticeEntry = {
  attemptId?: number;
  moduleId?: string;
  questionId?: string;
  correct?: boolean;
};

export type CapstoneLevel = "novice" | "competent" | "advanced" | "professional";
export type CapstoneDecision = "revise" | "pass";

export type CapstoneReview = {
  criteria?: Record<string, string>;
  decision?: CapstoneDecision;
  feedback?: string;
  level?: CapstoneLevel;
};

export type CapstoneSubmission = {
  id: number;
  userId?: string;
  projectId: string;
  status: string;
  summary: string;
  reflection?: string;
  score?: number;
  review?: CapstoneReview;
  certificateCode?: string;
};

/**
 * La vista que expone `learning.dashboard` aplana la revisión: `level` y
 * `decision` van en la raíz, no dentro de `review` como en la lista de admin.
 */
export type CapstoneReviewView = {
  level?: CapstoneLevel;
  decision?: CapstoneDecision;
  criteria?: Record<string, string>;
  feedback?: string;
};

export type PracticeAttempt = {
  attempt: { id: number };
  feedback: { content: string };
};

/** Todo lo que `learning.dashboard` puede devolver. */
export type DashboardData = {
  moduleProgress: ModuleProgressEntry[];
  latestQuizByModule: Record<string, QuizScore>;
  programProgress: number;
  programScore?: number;
  finalExamScore?: number;
  completedLessons: number;
  totalLessons: number;
  totalMinutes: number;
  nextLessonId: string | null;
  certificatesEarned: number;
  completedLessonIds: string[];
  practiceByModule: Record<string, number>;
  projects: ProjectSubmission[];
  notes: Note[];
  profile: Profile;
  capstoneReview?: CapstoneReviewView | null;
  passed?: boolean;
  score?: number;
};

export type MutationOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

export type QueryResult<TData> = {
  data: TData | null | undefined;
  error: null;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  status: "success";
  refetch: () => Promise<void>;
};

export type MutationResult<TData = unknown> = {
  mutate: (input?: unknown, options?: MutationOptions<TData>) => void;
  mutateAsync: (input?: unknown, options?: MutationOptions<TData>) => Promise<TData | undefined>;
  reset: () => void;
  data: TData | undefined;
  error: null;
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  status: "idle";
  variables: undefined;
};

type Query<TData> = { useQuery: (...args: unknown[]) => QueryResult<TData> };
type Mutation<TData = unknown> = {
  useMutation: (options?: MutationOptions<TData>, ...rest: unknown[]) => MutationResult<TData>;
};

/** Superficie realmente usada por la app. */
export type TrpcSurface = {
  useUtils: () => any;
  ai: {
    ask: Mutation<string>;
    chat: Mutation<string>;
    rewrite: Mutation<string>;
  };
  auth: {
    me: Query<Profile | null>;
    logout: Mutation;
  };
  admin: {
    capstoneSubmissions: Query<CapstoneSubmission[]>;
    issueCertificate: Mutation<{ certificateCode: string }>;
    reviewCapstone: Mutation;
  };
  finalExam: {
    submit: Mutation<{ passed: boolean; score: number }>;
  };
  learning: {
    dashboard: Query<DashboardData>;
    updateLesson: Mutation;
    updateLocale: Mutation;
  };
  notes: {
    remove: Mutation;
    save: Mutation;
  };
  practice: {
    history: Query<PracticeEntry[]>;
    reveal: Mutation<{ phase: string; content: string }>;
    submit: Mutation<PracticeAttempt>;
  };
  projects: {
    save: Mutation;
    evidence: {
      addFile: Mutation;
      addLink: Mutation;
      get: Query<{ evidence: EvidenceItem[]; submission: ProjectSubmission | null }>;
    };
  };
  quizzes: {
    submit: Mutation<QuizOutcome>;
  };
};

const noop = () => undefined;
const asyncNoop = async () => undefined;

function queryResult() {
  return {
    data: undefined,
    error: null,
    isLoading: false,
    isFetching: false,
    isPending: false,
    isError: false,
    isSuccess: true,
    status: "success" as const,
    refetch: asyncNoop,
  };
}

function mutationResult() {
  return {
    mutate: noop,
    mutateAsync: asyncNoop,
    reset: noop,
    data: undefined,
    error: null,
    isPending: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    status: "idle" as const,
    variables: undefined,
  };
}

/** Utilidades de caché (utils.x.y.setData / invalidate / fetch …) sin efecto. */
function utilsProxy(): any {
  return new Proxy(noop, {
    get: (_t, prop) => {
      if (prop === "invalidate" || prop === "refetch" || prop === "fetch" || prop === "prefetch" || prop === "cancel") return asyncNoop;
      if (prop === "setData" || prop === "reset") return noop;
      if (prop === "getData") return noop;
      return utilsProxy();
    },
  });
}

const overrides: Record<string, () => unknown> = {
  // Se mantiene el comportamiento anterior del panel: sin datos del servidor.
  "learning.dashboard.useQuery": () => ({ ...queryResult(), data: null }),
};

function routerProxy(path: string[] = []): any {
  return new Proxy(noop, {
    get: (_t, prop) => {
      if (typeof prop !== "string") return undefined;
      const key = [...path, prop].join(".");
      if (overrides[key]) return overrides[key];
      if (prop === "useQuery" || prop === "useSuspenseQuery" || prop === "useInfiniteQuery") return queryResult;
      if (prop === "useMutation") return mutationResult;
      if (prop === "useUtils" || prop === "useContext") return utilsProxy;
      return routerProxy([...path, prop]);
    },
  });
}

// El Proxy no es tipable directamente; el cast es al contrato real que implementa.
export const trpc = routerProxy() as TrpcSurface;
