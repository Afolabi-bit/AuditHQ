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
  // We don't persist the full parsedReport (too large, derived from fullReport)
  // Just the AI summary which is expensive to generate
  cachedAt: string; // ISO timestamp
}

// ─── Store Shape ────────────────────────────────────────────────────────────

interface AppState {
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

  /** Replace the full recent tests list */
  setTests: (tests: StoredTest[]) => void;

  /** Upsert a single test (add or update in-place, maintaining order) */
  upsertTest: (test: StoredTest) => void;

  /** Set aggregated dashboard stats */
  setStats: (stats: DashboardStats) => void;

  /** Write an AI summary for a test — idempotent, never overwrites existing */
  setAiSummaryOnce: (testId: string, summary: AiSummaryData) => void;

  /** Read AI summary for a test */
  getAiSummary: (testId: string) => AiSummaryData | null;

  /** Are stats considered fresh? (fresher than maxAgeMs) */
  isStatsFresh: (maxAgeMs?: number) => boolean;

  /** Are tests considered fresh? (fresher than maxAgeMs) */
  isTestsFresh: (maxAgeMs?: number) => boolean;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tests: {},
      testsOrder: [],
      aiSummaries: {},
      stats: null,
      statsLastFetched: null,
      testsLastFetched: null,

      setTests: (tests) => {
        const byId: Record<string, StoredTest> = {};
        const order: string[] = [];
        for (const t of tests) {
          byId[t.id] = t;
          order.push(t.id);
        }
        set({ tests: byId, testsOrder: order, testsLastFetched: Date.now() });
      },

      upsertTest: (test) => {
        set((state) => {
          const existing = state.tests[test.id];
          const updatedTests = { ...state.tests, [test.id]: test };
          let updatedOrder = state.testsOrder;

          // Prepend to order if brand new
          if (!existing) {
            updatedOrder = [test.id, ...state.testsOrder];
          }

          return { tests: updatedTests, testsOrder: updatedOrder, testsLastFetched: Date.now() };
        });
      },

      setStats: (stats) => {
        set({ stats, statsLastFetched: Date.now() });
      },

      setAiSummaryOnce: (testId, summary) => {
        set((state) => {
          // Never overwrite if already set
          if (state.aiSummaries[testId]) return state;
          return { aiSummaries: { ...state.aiSummaries, [testId]: summary } };
        });
      },

      getAiSummary: (testId) => {
        return get().aiSummaries[testId] ?? null;
      },

      isStatsFresh: (maxAgeMs = 120_000) => {
        const last = get().statsLastFetched;
        if (!last) return false;
        return Date.now() - last < maxAgeMs;
      },

      isTestsFresh: (maxAgeMs = 120_000) => {
        const last = get().testsLastFetched;
        if (!last) return false;
        return Date.now() - last < maxAgeMs;
      },
    }),
    {
      name: "zynex-app-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist lightweight data — skip large objects
      partialize: (state) => ({
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
