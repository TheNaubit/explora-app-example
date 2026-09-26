type NativeToastModule = {
  addListener: jest.Mock;
  dismiss: jest.Mock;
  show: jest.Mock;
};

jest.mock("expo", () => ({
  NativeModule: class {},
  requireOptionalNativeModule: jest.fn(() => null),
}));

jest.mock("react-native", () => ({
  Platform: { OS: "android" },
}));

describe("ExpoNativeToastModule", () => {
  beforeEach(() => {
    jest.resetModules();
    globalThis.expoV2 = undefined;
  });

  it("resolves an Android v2 module that installs after JavaScript imports", () => {
    let api: typeof import("./ExpoNativeToastModule") | undefined;
    jest.isolateModules(() => {
      api = require("./ExpoNativeToastModule");
    });

    expect(api?.isAvailable()).toBe(false);

    const nativeModule: NativeToastModule = {
      addListener: jest.fn(() => ({ remove: jest.fn() })),
      dismiss: jest.fn(),
      show: jest.fn(),
    };
    globalThis.expoV2 = {
      modules: {
        ExpoNativeToast: nativeModule as never,
      },
    };

    expect(api?.isAvailable()).toBe(true);
    api?.show({ title: "Saved", type: "success" });
    expect(nativeModule.show).toHaveBeenCalledWith({ title: "Saved", type: "success" });
  });
});
