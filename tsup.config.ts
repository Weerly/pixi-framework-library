import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/boot", "src/helpers", "src/types"],
    clean: true,
    format: ["cjs", "esm"],
    outDir: "./dist",
    dts: true,
    publicDir: true
});
