import {defineConfig} from "vite"
import {viteStaticCopy} from "vite-plugin-static-copy"

const browser = process.env.BROWSER || "chrome"

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
				inlineDynamicImports: true,
				manualChunks: undefined
			}
		},
		outDir: `dist/${browser}`,
		sourcemap: false,
		emptyOutDir: true
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: `assets/${browser}/manifest.json`,
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
