import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AiSummaryData } from "@/lib/ai/schema";
import { DashboardStats } from "@/app/utils/actions";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface StoredTest {
  id: string;
  createdAt: string; // ISO string for serializability
  domainId: string;
  device?: string;
  network?: string;
  status: string;
  errorMessage?: string | null;
  performanceScore: number | null;
  fcp: number | null;
  lcp: number | null;
  tbt: number | null;
  cls: number | null;
  domain: {
    id: string;
    url: string;
    device: string;
    network: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StoredReport {
  aiSummary: AiSummaryData | null;
  cachedAt: string; // ISO timestamp
}

// ─── Store Shape ────────────────────────────────────────────────────────────

interface AppState {
  // Currently authenticated user ID
  currentUserId: string | null;

  // Dashboard: list of recent tests keyed by id
  tests: Record<string, StoredTest>;
  testsOrder: string[]; // ordered list of ids (newest first)

  // Per-test AI summaries (lightweight, write-once)
  aiSummaries: Record<string, AiSummaryData>;

  // Dashboard aggregate stats
  stats: DashboardStats | null;
  statsLastFetched: number | null; // unix ms
  testsLastFetched: number | null; // unix ms

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Sync current user ID — flushes stale cached state if switching accounts */
  syncUser: (userId: string) => void;

  /** Clear all user-specific state on logout or account switch */
  clearUserSession: () => void;

  /** Replace the full recent tests list for the active user */
  setTests: (tests: StoredTest[], userId?: string) => void;

  /** Upsert a single test (add or update in-place, maintaining order) */
  upsertTest: (test: StoredTest) => void;

  /** Remove a test locally upon deletion */
  removeTest: (testId: string) => void;

  /** Set aggregated dashboard stats */
  setStats: (stats: DashboardStats, userId?: string) => void;

  /** Write an AI summary for a test — idempotent, never overwrites existing */
  setAiSummaryOnce: (testId: string, summary: AiSummaryData) => void;

  /** Read AI summary for a test */
  getAiSummary: (testId: string) => AiSummaryData | null;

  /** Are stats considered fresh? (checks user identity + maxAgeMs) */
  isStatsFresh: (userId?: string, maxAgeMs?: number) => boolean;

  /** Are tests considered fresh? (checks user identity + maxAgeMs) */
  isTestsFresh: (userId?: string, maxAgeMs?: number) => boolean;

  /** Safely get tests belonging to a specific user */
  getUserTests: (userId?: string) => StoredTest[];
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      tests: {},
      testsOrder: [],
      aiSummaries: {},
      stats: null,
      statsLastFetched: null,
      testsLastFetched: null,

      syncUser: (userId: string) => {
        if (!userId) return;
        const current = get().currentUserId;
        if (current && current !== userId) {
          // Switching user: Flush previous user's cached telemetry immediately
          set({
            currentUserId: userId,
            tests: {},
            testsOrder: [],
            stats: null,
            statsLastFetched: null,
            testsLastFetched: null,
          });
        } else if (!current) {
          set({ currentUserId: userId });
        }
      },

      clearUserSession: () => {
        set({
          currentUserId: null,
          tests: {},
          testsOrder: [],
          stats: null,
          statsLastFetched: null,
          testsLastFetched: null,
        });
      },

      setTests: (tests, userId) => {
        const activeUserId = userId ?? get().currentUserId;
        const byId: Record<string, StoredTest> = {};
        const order: string[] = [];

        for (const t of tests) {
          // Strictly reject any test not belonging to the active user
          if (activeUserId && t.domain?.ownerId && t.domain.ownerId !== activeUserId) {
            continue;
          }
          byId[t.id] = t;
          order.push(t.id);
        }

        set((state) => ({
          currentUserId: activeUserId ?? state.currentUserId,
          tests: byId,
          testsOrder: order,
          testsLastFetched: Date.now(),
        }));
      },

      upsertTest: (test) => {
        set((state) => {
          // Reject if domain owner doesn't match active store user
          if (
            state.currentUserId &&
            test.domain?.ownerId &&
            test.domain.ownerId !== state.currentUserId
          ) {
            return state;
          }

          const existing = state.tests[test.id];
          const updatedTests = { ...state.tests, [test.id]: test };
          let updatedOrder = state.testsOrder;

          // Prepend to order if brand new
          if (!existing) {
            updatedOrder = [test.id, ...state.testsOrder];
          }

          return {
            tests: updatedTests,
            testsOrder: updatedOrder,
            testsLastFetched: Date.now(),
          };
        });
      },

      removeTest: (testId) => {
        set((state) => {
          const { [testId]: _, ...remainingTests } = state.tests;
          const updatedOrder = state.testsOrder.filter((id) => id !== testId);
          return {
            tests: remainingTests,
            testsOrder: updatedOrder,
            testsLastFetched: Date.now(),
          };
        });
      },

      setStats: (stats, userId) => {
        const activeUserId = userId ?? get().currentUserId;
        set((state) => ({
          currentUserId: activeUserId ?? state.currentUserId,
          stats,
          statsLastFetched: Date.now(),
        }));
      },

      setAiSummaryOnce: (testId, summary) => {
        set((state) => {
          if (state.aiSummaries[testId]) return state;
          return { aiSummaries: { ...state.aiSummaries, [testId]: summary } };
        });
      },

      getAiSummary: (testId) => {
        return get().aiSummaries[testId] ?? null;
      },

      isStatsFresh: (userId?: string, maxAgeMs = 120_000) => {
        const state = get();
        // Stale if user identity mismatch
        if (userId && state.currentUserId !== userId) return false;
        const last = state.statsLastFetched;
        if (!last) return false;
        return Date.now() - last < maxAgeMs;
      },

      isTestsFresh: (userId?: string, maxAgeMs = 120_000) => {
        const state = get();
        // Stale if user identity mismatch
        if (userId && state.currentUserId !== userId) return false;
        const last = state.testsLastFetched;
        if (!last) return false;
        return Date.now() - last < maxAgeMs;
      },

      getUserTests: (userId?: string) => {
        const state = get();
        if (userId && state.currentUserId !== userId) {
          return [];
        }
        return state.testsOrder
          .map((id) => state.tests[id])
          .filter((t): t is StoredTest => {
            if (!t) return false;
            if (userId && t.domain?.ownerId && t.domain.ownerId !== userId) {
              return false;
            }
            return true;
          });
      },
    }),
    {
      name: "zynex-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        tests: state.tests,
        testsOrder: state.testsOrder,
        aiSummaries: state.aiSummaries,
        stats: state.stats,
        statsLastFetched: state.statsLastFetched,
        testsLastFetched: state.testsLastFetched,
      }),
    }
  )
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert a raw Prisma test object into a store-safe StoredTest */
export function toStoredTest(test: any): StoredTest {
  return {
    id: String(test.id),
    createdAt:
      test.createdAt instanceof Date
        ? test.createdAt.toISOString()
        : String(test.createdAt),
    domainId: String(test.domainId),
    device: test.device ?? test.domain?.device,
    network: test.network ?? test.domain?.network,
    status: test.status,
    errorMessage: test.errorMessage ?? null,
    performanceScore: test.performanceScore ?? null,
    fcp: test.fcp ?? null,
    lcp: test.lcp ?? null,
    tbt: test.tbt ?? null,
    cls: test.cls ?? null,
    domain: test.domain
      ? {
          id: String(test.domain.id),
          url: test.domain.url,
          device: test.domain.device,
          network: test.domain.network,
          ownerId: test.domain.ownerId,
          createdAt:
            test.domain.createdAt instanceof Date
              ? test.domain.createdAt.toISOString()
              : String(test.domain.createdAt),
          updatedAt:
            test.domain.updatedAt instanceof Date
              ? test.domain.updatedAt.toISOString()
              : String(test.domain.updatedAt),
        }
      : {
          id: "",
          url: "",
          device: "desktop",
          network: "No Throttling",
          ownerId: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
  };
}
