import { fileURLToPath, URL } from "node:url";
// import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // createSvgIconsPlugin({
    //   // 指定 SVG图标 保存的文件夹路径
    //   iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
    //   // 指定 使用svg图标的格式
    //   symbolId: "icon-[dir]-[name]",
    // }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
