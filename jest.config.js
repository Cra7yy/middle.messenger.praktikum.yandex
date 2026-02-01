import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
};
