/**
 * Cliente tRPC offline.
 *
 * La versión publicada de UX Academy es estática (sin servidor), así que
 * cualquier procedimiento tRPC (`trpc.x.y.useQuery`, `useMutation`,
 * `useUtils`, …) se resuelve aquí con respuestas vacías y seguras.
 * Así la app funciona en modo invitado en lugar de romperse con
 * "trpc.useUtils is not a function".
 */

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

export const trpc: any = routerProxy();
