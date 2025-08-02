import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "src/main.ts",
			name: "GitHubReactionsExtension",
			fileName: "index",
			formats: ["es"],
		},
		rollupOptions: {
			output: {
				// Ensure the bundle is self-contained
				inlineDynamicImports: true,
				// Generate a single file
				manualChunks: undefined,
			},
		},
		// Output to dist directory
		outDir: "dist",
		// Generate source maps for debugging
		sourcemap: false,
	},
});
