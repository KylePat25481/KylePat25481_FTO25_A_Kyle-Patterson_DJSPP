import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  base: process.env.VITE_BASE_PATH || "/KylePat25481_FTO25_A_Kyle-Patterson_DJSPP",
});
