import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import {
  BottomSheet,
  Button,
  DatePicker,
  GlassEffectContainer,
  Group,
  Host,
  HStack,
  RNHostView,
  Spacer,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  datePickerStyle,
  font,
  frame,
  interactiveDismissDisabled,
  padding,
  presentationDragIndicator,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useLingui } from "@lingui/react/macro";

import { DEFAULT_EVENT_START_DELAY_MINUTES, MILLISECONDS_PER_MINUTE } from "@/calendar/constants";
import type { CalendarSchedulePickerProps } from "@/screens/activity-detail/calendar-schedule-picker.types";
import { activityDetailMessages } from "@/screens/activity-detail/messages";
import { spacing, useAppTheme } from "@/theme";

const SHEET_MAX_WIDTH = 600;

function createInitialDraft(): Date {
  return new Date(Date.now() + DEFAULT_EVENT_START_DELAY_MINUTES * MILLISECONDS_PER_MINUTE);
}

/** Fitted iOS schedule sheet with one native date and time picker. */
export function CalendarSchedulePicker({
  isOpen,
  onCancel,
  onConfirm,
  trigger,
}: CalendarSchedulePickerProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const [draft, setDraft] = useState(createInitialDraft);
  const pendingConfirmation = useRef<Date | null>(null);
  const usesLiquidGlass = isLiquidGlassAvailable();
  const cancelStyle = buttonStyle(usesLiquidGlass ? "glass" : "bordered");
  const doneStyle = buttonStyle(usesLiquidGlass ? "glassProminent" : "borderedProminent");

  function cancelPicker() {
    pendingConfirmation.current = null;
    onCancel();
  }

  function confirmPicker() {
    pendingConfirmation.current = draft;
    onCancel();
  }

  function finishDismissal() {
    const confirmedDate = pendingConfirmation.current;
    pendingConfirmation.current = null;
    setDraft(createInitialDraft());
    if (confirmedDate) onConfirm(confirmedDate);
  }

  const header = (
    <HStack
      alignment="center"
      modifiers={[frame({ maxWidth: SHEET_MAX_WIDTH }), padding({ horizontal: spacing.space16 })]}
      spacing={spacing.space12}
    >
      <Button
        label={t(activityDetailMessages.calendarCancel)}
        modifiers={[cancelStyle, tint(theme.colors.accent)]}
        onPress={cancelPicker}
        testID="calendar-schedule-cancel"
      />
      <Spacer />
      <Text modifiers={[font({ textStyle: "headline", weight: "semibold" })]}>
        {t(activityDetailMessages.calendarScheduleSheetTitle)}
      </Text>
      <Spacer />
      <Button
        label={t(activityDetailMessages.calendarDone)}
        modifiers={[doneStyle, tint(theme.colors.accent)]}
        onPress={confirmPicker}
        testID="calendar-schedule-confirm"
      />
    </HStack>
  );

  return (
    <Host
      colorScheme={theme.colorScheme}
      matchContents={{ horizontal: false, vertical: true }}
      seedColor={theme.colors.accent}
      style={styles.hostContainer}
      testID={isOpen ? "calendar-schedule-sheet" : undefined}
    >
      <VStack modifiers={[frame({ maxWidth: Infinity })]}>
        <BottomSheet
          fitToContents
          isPresented={isOpen}
          anchor={<RNHostView matchContents>{trigger}</RNHostView>}
          onDismiss={finishDismissal}
          onIsPresentedChange={() => {}}
        >
          <Group modifiers={[presentationDragIndicator("hidden"), interactiveDismissDisabled()]}>
            <VStack
              modifiers={[
                frame({ maxWidth: SHEET_MAX_WIDTH }),
                padding({ top: spacing.space16, bottom: spacing.space24 }),
              ]}
              spacing={spacing.space16}
            >
              {usesLiquidGlass ? (
                <GlassEffectContainer spacing={spacing.space16}>{header}</GlassEffectContainer>
              ) : (
                header
              )}
              <DatePicker
                displayedComponents={["date", "hourAndMinute"]}
                modifiers={[
                  datePickerStyle("graphical"),
                  tint(theme.colors.accent),
                  padding({ horizontal: spacing.space16 }),
                ]}
                onDateChange={setDraft}
                range={{ start: new Date() }}
                selection={draft}
                testID="calendar-date-time-picker"
                title={t(activityDetailMessages.calendarScheduleSheetTitle)}
              />
            </VStack>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}

const styles = StyleSheet.create({
  hostContainer: {
    width: "100%",
  },
});
