module.exports = {
  env: {
    browser: false,
    es2021: true
  },
  extends: "standard-with-typescript",
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json"
  },
  rules: {
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "no-trailing-spaces": "off",
    quotes: "off",
    "@typescript-eslint/quotes": "warn"
  }
}
