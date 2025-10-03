module.exports = {
  root: true,
  extends: ["eslint:recommended", "@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", "build/"],
};
