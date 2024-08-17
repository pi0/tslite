import unjs from "eslint-config-unjs";

// https://github.com/unjs/eslint-config
export default unjs({
  ignores: ["lib"],
  rules: {
    "unicorn/prefer-top-level-await": 0,
    "unicorn/prefer-module": 0,
  },
});
