import path from "node:path";
import webExtension from "vite-plugin-web-extension";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const manifest = {
	name: "__MSG_appName__",
	version: "1.0.0",
	manifest_version: 2,
	description: "__MSG_appDescription__",
	icons: {
		"16": "icons/icon_16.png",
		"48": "icons/icon_48.png",
		"128": "icons/icon_128.png",
	},
	minimum_chrome_version: "68.0.0",
	default_locale: "en",
	background: {
		service_worker: "src/background/sw.js",
	},
	browser_action: {
		default_icon: {
			"16": "icons/icon_16.png",
			"48": "icons/icon_48.png",
			"128": "icons/icon_128.png",
		},
		default_title: "__MSG_appName__",
	},
	content_scripts: [
		{
			matches: ["http://*/*", "https://*/*"],
			exclude_matches: ["http://*/*.xml", "https://*/*.xml"],
			js: ["src/content/content.js"],
			run_at: "document_start",
		},
	],
	permissions: [],
	web_accessible_resources: ["src/app/index.html", "src/login/login.html"],
	content_security_policy: "script-src 'self'; object-src 'self'",
};

export default defineConfig({
	build: {
		outDir: path.resolve(__dirname, "dist"),
		emptyOutDir: true,
	},
	plugins: [
		react({
			babel: {
				plugins: [
					[
						"babel-plugin-jsx-pragmatic",
						{ export: "jsx", module: "@emotion/core", import: "___EmotionJSX" },
					],
					[
						"@babel/plugin-transform-react-jsx",
						{ pragma: "___EmotionJSX", pragmaFrag: "React.Fragment" },
					],
					["emotion"],
				],
			},
			jsxRuntime: "classic",
		}),
		webExtension({
			manifest: () => manifest,
			assets: "icons",
			verbose: true,
			additionalInputs: [
				path.resolve(__dirname, "src/app/index.html"),
				path.resolve(__dirname, "src/login/login.html"),
			],
		}),
	],
	resolve: {
		alias: {
			"~": path.resolve(__dirname),
			src: path.resolve(__dirname, "src"),
			app: path.resolve(__dirname, "src/app"),
			shared: path.resolve(__dirname, "src/shared"),
		},
	},
});
