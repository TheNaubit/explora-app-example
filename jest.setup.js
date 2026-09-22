/**
 * Early Jest mocks for modules that need a native link or a deterministic fake.
 * Do not mock `react-native` itself. Use React Native Testing Library for UI.
 */
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(async () => ({
    isConnected: true,
    isInternetReachable: true,
    type: "WIFI",
  })),
  addNetworkStateListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

jest.mock("expo-symbols", () => ({
  SymbolView: "SymbolView",
}));

jest.mock("@/i18n/polyfills", () => ({}));

jest.mock("react-native-a11y", () => {
  const React = require("react");
  const { View, TextInput, Pressable } = require("react-native");
  const passthrough =
    (Component) =>
    ({ children, ...rest }) =>
      React.createElement(Component, rest, children);

  function MockCard({
    children,
    PressableComponent,
    style,
    onPress,
    testID,
    accessibility,
    pressableProps,
  }) {
    const Surface = PressableComponent || Pressable;
    const resolvedStyle =
      typeof style === "function" ? style({ pressed: false, focused: false }) : style;
    return React.createElement(
      Surface,
      {
        ...pressableProps,
        ...accessibility,
        style: resolvedStyle,
        onPress,
        testID,
        accessible: true,
      },
      children,
    );
  }

  return {
    A11y: {
      Provider: ({ children }) => children,
      View: passthrough(View),
      Pressable: ({ children, style, ...rest }) => {
        const resolvedStyle =
          typeof style === "function" ? style({ pressed: false, focused: false }) : style;
        return React.createElement(Pressable, { ...rest, style: resolvedStyle }, children);
      },
      Input: passthrough(TextInput),
      Card: MockCard,
      ScreenChange: () => null,
    },
    A11yProvider: ({ children }) => children,
    announce: jest.fn(),
    mergeFocusedStyle: (style) => style,
  };
});

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (Component) => Component,
      call: () => {},
    },
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (factory) => factory(),
    useReducedMotion: jest.fn(() => false),
    withRepeat: (value) => value,
    withTiming: (value) => value,
    Easing: { inOut: () => undefined, ease: undefined },
  };
});

jest.mock("@legendapp/list/react-native", () => {
  const React = require("react");
  const { View, Pressable } = require("react-native");
  return {
    LegendList: function MockLegendList({
      data,
      renderItem,
      keyExtractor,
      ListHeaderComponent,
      ListFooterComponent,
      testID,
      refreshControl,
      onEndReached,
    }) {
      const onRefresh = refreshControl?.props?.onRefresh;
      return React.createElement(
        View,
        { testID },
        onRefresh
          ? React.createElement(Pressable, {
              testID: "refresh-control",
              onPress: onRefresh,
              accessibilityRole: "button",
            })
          : null,
        ListHeaderComponent,
        data.map((item, index) =>
          React.createElement(
            View,
            { key: keyExtractor ? keyExtractor(item, index) : String(index) },
            renderItem({ item }),
          ),
        ),
        onEndReached
          ? React.createElement(Pressable, {
              testID: "list-end-reached",
              onPress: onEndReached,
              accessibilityRole: "button",
            })
          : null,
        ListFooterComponent,
      );
    },
  };
});
