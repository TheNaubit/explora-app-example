import { createMMKV } from "react-native-mmkv";
import { z } from "zod";

import { REFRESH_FAKER_BASE_SEED } from "@/mocks/constants";
import { generateActivity, refreshActivityId } from "@/mocks/generate-activity";
import { seedCatalog, seedPerformanceCatalog } from "@/mocks/seed-catalog";
import { activitySchema, type Activity } from "@/schemas/activity";
import {
  CATALOG_MODE_PERSIST_KEY,
  CATALOG_REFRESH_PERSIST_KEY,
  CATALOG_REFRESH_PERSIST_VERSION,
  EXPLORA_MMKV_ID,
} from "@/state/constants";

const persistedRefreshCatalogSchema = z.object({
  activities: z.array(activitySchema),
  refreshSequence: z.number().int().nonnegative(),
  version: z.literal(CATALOG_REFRESH_PERSIST_VERSION),
});

type PersistedRefreshCatalog = z.infer<typeof persistedRefreshCatalogSchema>;
export type CatalogMode = "supplied" | "performance";

const catalogModeSchema = z.enum(["supplied", "performance"]);

const catalogStorage = createMMKV({ id: EXPLORA_MMKV_ID });

let catalog: Activity[] | null = null;
let catalogMode: CatalogMode | null = null;
let refreshActivities: Activity[] = [];
let refreshSequence = 0;

function emptyPersistedRefreshCatalog(): PersistedRefreshCatalog {
  return {
    activities: [],
    refreshSequence: 0,
    version: CATALOG_REFRESH_PERSIST_VERSION,
  };
}

function readPersistedRefreshCatalog(): PersistedRefreshCatalog {
  const storedValue = catalogStorage.getString(CATALOG_REFRESH_PERSIST_KEY);
  if (storedValue === undefined) {
    return emptyPersistedRefreshCatalog();
  }

  try {
    const result = persistedRefreshCatalogSchema.safeParse(JSON.parse(storedValue));
    if (result.success) {
      return result.data;
    }
  } catch {
    // Remove invalid local data and restore the supplied catalog.
  }

  catalogStorage.remove(CATALOG_REFRESH_PERSIST_KEY);
  return emptyPersistedRefreshCatalog();
}

function persistRefreshCatalog(state: PersistedRefreshCatalog): void {
  catalogStorage.set(CATALOG_REFRESH_PERSIST_KEY, JSON.stringify(state));
}

function readPersistedCatalogMode(): CatalogMode {
  const storedValue = catalogStorage.getString(CATALOG_MODE_PERSIST_KEY);
  const result = catalogModeSchema.safeParse(storedValue);

  if (result.success) {
    return result.data;
  }

  catalogStorage.remove(CATALOG_MODE_PERSIST_KEY);
  return "supplied";
}

function baseCatalogForMode(mode: CatalogMode): Activity[] {
  return mode === "performance" ? seedPerformanceCatalog() : seedCatalog();
}

function ensureCatalog(): Activity[] {
  if (catalog === null) {
    const persisted = readPersistedRefreshCatalog();
    refreshActivities = [...persisted.activities];
    refreshSequence = persisted.refreshSequence;
    catalogMode = readPersistedCatalogMode();
    catalog = [...refreshActivities, ...baseCatalogForMode(catalogMode)];
  }

  return catalog;
}

/** Current in-memory catalog (seeds on first read). */
export function getCatalog(): readonly Activity[] {
  return ensureCatalog();
}

/** Current catalog length. */
export function getCatalogSize(): number {
  return ensureCatalog().length;
}

/** Current reproducible catalog dataset. */
export function getCatalogMode(): CatalogMode {
  ensureCatalog();
  return catalogMode ?? "supplied";
}

/** Select the normal supplied dataset or the performance dataset. */
export function setCatalogMode(nextMode: CatalogMode): void {
  ensureCatalog();
  catalogStorage.set(CATALOG_MODE_PERSIST_KEY, nextMode);
  catalogMode = nextMode;
  catalog = [...refreshActivities, ...baseCatalogForMode(nextMode)];
}

/** Find one activity by id, or undefined when missing. */
export function findActivityById(id: string): Activity | undefined {
  return ensureCatalog().find((activity) => activity.id === id);
}

/**
 * Insert one refresh-generated activity at the start of Explore.
 * Returns the new activity. Callers must only invoke this on a successful refresh path.
 */
export function prependRefreshActivity(): Activity {
  const currentCatalog = ensureCatalog();
  const nextRefreshSequence = refreshSequence + 1;
  const activity = generateActivity({
    id: refreshActivityId(nextRefreshSequence),
    seed: REFRESH_FAKER_BASE_SEED + nextRefreshSequence,
  });
  const nextRefreshActivities = [activity, ...refreshActivities];

  persistRefreshCatalog({
    activities: nextRefreshActivities,
    refreshSequence: nextRefreshSequence,
    version: CATALOG_REFRESH_PERSIST_VERSION,
  });

  refreshSequence = nextRefreshSequence;
  refreshActivities = nextRefreshActivities;
  currentCatalog.unshift(activity);
  return activity;
}

/**
 * Reset the catalog to the supplied baseline and clear refresh sequence.
 * Does not change review modes.
 */
export function resetCatalog(): void {
  catalogStorage.remove(CATALOG_REFRESH_PERSIST_KEY);
  catalogStorage.remove(CATALOG_MODE_PERSIST_KEY);
  catalogMode = "supplied";
  catalog = seedCatalog();
  refreshActivities = [];
  refreshSequence = 0;
}

/**
 * Test-only: replace the in-memory catalog without reseeding.
 * Use this to exercise validation and not-found paths.
 */
export function replaceCatalogForTests(next: Activity[], nextRefreshSequence = 0): void {
  catalog = [...next];
  catalogMode = "supplied";
  refreshActivities = [];
  refreshSequence = nextRefreshSequence;
}

/**
 * Test-only: clear the catalog so the next read reseeds from `seedCatalog`.
 */
export function clearCatalogForTests(): void {
  catalog = null;
  catalogMode = null;
  refreshActivities = [];
  refreshSequence = 0;
}
