import { Explore } from "@/screens/explore";
import { ExploreNativeSearch } from "@/screens/explore/explore-native-search";

/**
 * Explore tab route.
 * List content is first so iOS can bind large title collapse and search hide-on-scroll.
 * Stack title and search bar return null host views and register header options.
 */
export default function ExploreRoute() {
  return (
    <>
      <Explore />
      <ExploreNativeSearch />
    </>
  );
}
