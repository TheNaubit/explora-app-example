import { createElement } from "react";
import { render, screen } from "@testing-library/react-native";

import { AppTabs } from "@/components/app-tabs";
import { createProviders } from "@/test/ui-test-utils";

jest.mock("expo-router/native-tabs", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  function NativeTabs({ children }: { children: React.ReactNode }) {
    return React.createElement(View, null, children);
  }

  const Trigger = function Trigger({
    children,
    name,
    role,
  }: {
    children: React.ReactNode;
    name: string;
    role?: string;
  }) {
    return React.createElement(View, { role, testID: `tab-${name}` }, children);
  };
  Trigger.Icon = () => null;
  Trigger.Label = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Text, null, children);
  NativeTabs.Trigger = Trigger;

  return { NativeTabs };
});

describe("AppTabs", () => {
  it("shows Explore and Saved without a separate Search route", async () => {
    await render(createElement(AppTabs), { wrapper: createProviders() });

    expect(screen.getByTestId("tab-(explore)")).toBeTruthy();
    expect(screen.getByTestId("tab-saved")).toBeTruthy();
    expect(screen.queryByTestId("tab-search")).toBeNull();
  });
});
