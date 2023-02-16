import svgIcon from './svg-icon/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
export default {
    install(app) {
        app.component('svg-icon', svgIcon)

        // 注册 ElementPlus 图标
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}