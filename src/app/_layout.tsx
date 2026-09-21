import { Stack } from "expo-router";

import { A11yProvider } from "@/a11y";

/**
 * Root layout. `A11yProvider` is a compatibility shim from react-native-a11y 0.9.
 * Keep it so the tree stays ready if the library adds real context later.
 */
export default function RootLayout() {
  return (
    <A11yProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Explora" }} />
      </Stack>
    </A11yProvider>
  );
}
