import { createQueryClient } from "@/query/client";

/** Create a Query client without cache timers that can keep Jest active. */
export function createTestQueryClient() {
  return createQueryClient({ gcTime: Infinity });
}
