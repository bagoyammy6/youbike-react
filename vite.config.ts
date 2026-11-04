/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 的網址是 https://bagoyammy6.github.io/youbike-react/
  base: process.env.NODE_ENV === "production" ? "/youbike-react/" : "/",
  test: {
    environment: "jsdom",
  },
});
