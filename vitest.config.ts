import { defineConfig } from "vitest/config";
import path from "path";
import fs from "fs";

// Load .env and .env.local into process.env for test runner
for (const envFile of [".env", ".env.local"]) {
  const envPath = path.resolve(__dirname, envFile);
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length > 0) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    }
  }
}

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

