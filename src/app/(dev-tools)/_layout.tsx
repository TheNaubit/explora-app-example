import { Stack } from "expo-router";
import { useLingui } from "@lingui/react/macro";

import { devToolsMessages } from "@/screens/dev-tools/messages";
import { useAppTheme } from "@/theme";

/** Native stack for the Dev Tools settings tab. */
export default function DevToolsLayout() {
  const { t } = useLingui();
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.background },
        headerLargeTitleEnabled: true,
        headerShadowVisible: false,
        title: t(devToolsMessages.title),
      }}
    />
  );
}
