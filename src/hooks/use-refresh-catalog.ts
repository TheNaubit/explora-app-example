import { useMutation, useQueryClient } from "@tanstack/react-query";

import { runRefreshCatalog } from "@/query/activity-queries";

/**
 * Refresh the catalog (+1 activity on success).
 * Invalidates list queries. Does not clear favorites or offline snapshots.
 */
export function useRefreshCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => runRefreshCatalog(queryClient),
  });
}
