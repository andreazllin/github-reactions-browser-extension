import {defineConfig} from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts",
			name: "GitHubReactionsExtension",
			fileName: "index",
			formats: ["es"]
		},
		rollupOptions: {
			output: {
				// Ensure the bundle is self-contained
				inlineDynamicImports: true,
				// Generate a single file
				manualChunks: undefined
			}
		},
		// Output to dist directory
		outDir: "dist",
		// Generate source maps for debugging
		sourcemap: false
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "assets/chrome/manifest.json",
					dest: "."
				},
				{
					src: "assets/icons/*",
					dest: "."
				}
			]
		})
	]
})
