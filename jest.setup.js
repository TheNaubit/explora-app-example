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

jest.mock("react-native-pulsar", () => require("react-native-pulsar/jest-mock"));

jest.mock("@bsky.app/expo-scroll-edge-effect", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ScrollEdgeEffectProvider: ({ children }) => children,
    ScrollEdgeEffect: ({ children, ...rest }) => React.createElement(View, rest, children),
    useScrollEdgeEffectRef: () => () => {},
  };
});

jest.mock("expo-blur", () => ({
  BlurView: "BlurView",
}));

jest.mock("@expo/ui", () => {
  const React = require("react");
  const { View, Pressable, ScrollView, Text } = require("react-native");

  function Host({ children, ...rest }) {
    return React.createElement(View, rest, children);
  }

  function Button({ label, children, onPress, testID, ...rest }) {
    return React.createElement(
      Pressable,
      { onPress, testID, accessibilityRole: "button", ...rest },
      children ?? React.createElement(Text, null, label),
    );
  }

  function Row({ children, ...rest }) {
    return React.createElement(
      View,
      { ...rest, style: [{ flexDirection: "row", flexWrap: "wrap" }, rest.style] },
      children,
    );
  }

  function ExpoScrollView({ children, direction, ...rest }) {
    return React.createElement(
      ScrollView,
      { horizontal: direction === "horizontal", ...rest },
      children,
    );
  }

  return {
    Host,
    Button,
    Row,
    ScrollView: ExpoScrollView,
    Column: View,
    Text,
  };
});

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Image: function MockExpoImage(props) {
      return React.createElement(View, {
        testID: props.testID,
        accessibilityElementsHidden: props.accessibilityElementsHidden,
        importantForAccessibility: props.importantForAccessibility,
      });
    },
  };
});

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
  const { ScrollView, Text, View } = require("react-native");
  return {
    __esModule: true,
    default: {
      View,
      ScrollView,
      Text,
      createAnimatedComponent: (Component) => Component,
      call: () => {},
    },
    Extrapolation: { CLAMP: "clamp" },
    interpolate: (value, input, output) => {
      if (value <= input[0]) return output[0];
      if (value >= input[input.length - 1]) return output[output.length - 1];
      const progress = (value - input[0]) / (input[input.length - 1] - input[0]);
      return output[0] + progress * (output[output.length - 1] - output[0]);
    },
    useSharedValue: (value) => ({
      value,
      get() {
        return this.value;
      },
      set(next) {
        this.value = typeof next === "function" ? next(this.value) : next;
      },
    }),
    useAnimatedScrollHandler: (handler) => handler,
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
      keyboardDismissMode,
      keyboardShouldPersistTaps,
      onMomentumScrollEnd,
      onScrollBeginDrag,
      snapToInterval,
      decelerationRate,
      disableIntervalMomentum,
    }) {
      const onRefresh = refreshControl?.props?.onRefresh;
      return React.createElement(
        View,
        {
          testID,
          keyboardDismissMode,
          keyboardShouldPersistTaps,
          onMomentumScrollEnd,
          onScrollBeginDrag,
          snapToInterval,
          decelerationRate,
          disableIntervalMomentum,
        },
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
            renderItem({ item, index }),
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

jest.mock("@legendapp/list/reanimated", () => ({
  AnimatedLegendList: require("@legendapp/list/react-native").LegendList,
}));
