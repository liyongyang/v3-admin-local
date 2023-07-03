import { defineConfig, presetAttributify, presetUno } from "unocss"

export default defineConfig({
  /** 排除 */
  exclude: ["node_modules"],
  /** 预设 */
  presets: [
    /** 属性化模式 & 无值的属性模式 */
    presetAttributify(),
    /** 默认预设 */
    presetUno()
  ],
  /** 自定义规则 */
  rules: [
    ["uno-padding-20", { padding: "20px" }],
    ["uno-pading-0-20", { padding: "0 20px" }]
  ],
  /** 自定义快捷方式 */
  shortcuts: {
    "wh-full": "w-full h-full",
    "uno-flex-center": "flex justify-center items-center",
    "uno-flex-sb": "flex justify-between items-center",
    "uno-flex-x-center": "flex justify-center",
    "uno-flex-y-center": "flex items-center"
  }
})
