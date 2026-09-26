import "@testing-library/react-native/matchers";

const { notifyManager } = require("@tanstack/react-query");

notifyManager.setScheduler(queueMicrotask);
