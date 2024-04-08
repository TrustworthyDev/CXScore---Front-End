module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    // "plugin:import/typescript",
  ],
  rules: {
    "consistent-return": ["error"],
    curly: ["error"],
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    "no-console": ["warn"],
    "no-debugger": ["warn"],
    "no-unused-vars": ["warn"],
    "no-param-reassign": ["error"],
    "object-shorthand": ["error", "always"],
    "react/jsx-uses-react": ["off"], // React 17+ does not require importing 'react' in files
    "react/react-in-jsx-scope": ["off"], // React 17+ does not require importing 'react' in files
    "react-hooks/rules-of-hooks": ["error"],
    "react-hooks/exhaustive-deps": ["error"],
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Built-in imports (come from NodeJS native) go first
          "external", // <- External imports
          "internal", // <- Absolute imports
          ["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
          "index", // <- index imports
          "unknown", // <- unknown
        ],
        "newlines-between": "always",
        alphabetize: {
          /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
          order: "asc",
          /* ignore case. Options: [true, false] */
          caseInsensitive: true,
        },
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": ["off"], // Allow inference of return types
    "@typescript-eslint/no-empty-interface": ["off"], // Allow empty interfaces
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
    "import/resolver": {
      typescript: {},
    },
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "react/prop-types": "off"
      }
    }
  ]
};
