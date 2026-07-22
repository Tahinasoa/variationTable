import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath : "tsconfig.build.json"
    })
  ],

  build: {
    lib: {
      entry: "./src/index.ts",
      name: "tkz-tab-react",
      formats: ["es", "cjs"],
      fileName: "variation-table"
    },

    rollupOptions: {
      external: [
      /^react/,
      /^katex/
      ]
    }
  }
});