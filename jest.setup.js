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

jest.mock("expo-blur", () => ({
  BlurView: "BlurView",
}));

jest.mock("expo-calendar", () => ({
  getDefaultCalendarSync: jest.fn(() => ({
    addEventWithForm: jest.fn(async () => ({ action: "saved", id: "event-1" })),
  })),
  requestCalendarPermissions: jest.fn(async () => ({
    canAskAgain: true,
    status: "granted",
  })),
}));

jest.mock("expo-calendar/legacy", () => ({
  createEventInCalendarAsync: jest.fn(async () => ({ action: "done", id: null })),
  isAvailableAsync: jest.fn(async () => true),
}));

jest.mock("@expo/ui/community/datetime-picker", () => {
  const React = require("react");
  const { View } = require("react-native");

  return function MockDateTimePicker(props) {
    return React.createElement(View, props);
  };
});

jest.mock("@expo/ui/swift-ui", () => {
  const React = require("react");
  const { Pressable, Text: NativeText, View } = require("react-native");

  function Container({ children, ...rest }) {
    return React.createElement(View, rest, children);
  }

  function BottomSheet({ anchor, children, isPresented }) {
    return React.createElement(
      View,
      null,
      anchor,
      isPresented ? React.createElement(View, null, children) : null,
    );
  }

  function Button({ label, onPress, testID }) {
    return React.createElement(
      Pressable,
      { accessibilityRole: "button", onPress, testID },
      React.createElement(NativeText, null, label),
    );
  }

  function DatePicker(props) {
    return React.createElement(View, props);
  }

  return {
    BottomSheet,
    Button,
    DatePicker,
    GlassEffectContainer: Container,
    Group: Container,
    Host: Container,
    HStack: Container,
    RNHostView: Container,
    Spacer: View,
    Text: NativeText,
    VStack: Container,
  };
});

jest.mock("@expo/ui/swift-ui/modifiers", () => {
  const modifier =
    (name) =>
    (...args) => ({ args, name });

  return {
    buttonStyle: modifier("buttonStyle"),
    datePickerStyle: modifier("datePickerStyle"),
    font: modifier("font"),
    frame: modifier("frame"),
    interactiveDismissDisabled: modifier("interactiveDismissDisabled"),
    padding: modifier("padding"),
    presentationDragIndicator: modifier("presentationDragIndicator"),
    presentationSizing: modifier("presentationSizing"),
    tint: modifier("tint"),
  };
});

jest.mock("@shopify/react-native-skia", () => {
  const React = require("react");
  const { View } = require("react-native");

  function Canvas({ children, style, testID }) {
    return React.createElement(View, { style, testID }, children);
  }

  return {
    Atlas: () => null,
    Canvas,
    FilterMode: { Linear: "linear" },
    MipmapMode: { None: "none" },
    makeImageFromView: jest.fn(async () => ({
      height: () => 300,
      width: () => 300,
    })),
    rect: (x, y, width, height) => ({ height, width, x, y }),
    useColorBuffer: () => ({ value: [] }),
    useRSXformBuffer: () => ({ value: [] }),
  };
});

jest.mock("react-native-worklets", () => ({
  scheduleOnRN: (callback, ...args) => callback(...args),
}));

jest.mock("@bsky.app/expo-scroll-edge-effect", () => ({
  ScrollEdgeEffect: ({ children }) => children,
  ScrollEdgeEffectProvider: ({ children }) => children,
  useScrollEdgeEffectRef: () => ({ current: null }),
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
      FocusTrap: passthrough(View),
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
    interpolateColor: (value, input, output) =>
      value >= input[input.length - 1] ? output[output.length - 1] : output[0],
    useSharedValue: (value) => ({
      value,
      get() {
        return this.value;
      },
      set(next) {
        this.value = typeof next === "function" ? next(this.value) : next;
      },
    }),
    useDerivedValue: (factory) => ({
      get: factory,
    }),
    useAnimatedScrollHandler: (handler) => (event) => handler(event.nativeEvent ?? event),
    useAnimatedProps: (factory) => factory(),
    useAnimatedStyle: (factory) => factory(),
    useReducedMotion: jest.fn(() => false),
    withRepeat: (value) => value,
    withTiming: (value, _config, callback) => {
      callback?.(true);
      return value;
    },
    Easing: { bezier: () => undefined, inOut: () => undefined, ease: undefined, linear: undefined },
    LinearTransition: {
      duration: () => ({
        easing: () => undefined,
      }),
    },
    cancelAnimation: jest.fn(),
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
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      initialScrollOffset,
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
          onScroll,
          onScrollBeginDrag,
          onScrollEndDrag,
          initialScrollOffset,
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
