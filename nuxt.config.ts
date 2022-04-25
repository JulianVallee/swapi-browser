import {defineNuxtConfig} from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,

    vite: {
        build: {
            target: "es2020"
        },
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020'
            }
        }
    },

    loadingIndicator: {
        name: 'circle',
        color: '#3B8070',
        background: 'white'
    },

    /* @ts-ignore */

    // loading: {
    //     color: 'DodgerBlue',
    //     height: '10px'
    // },

    vue: {
        config: {
            productionTip: false,
            devtools: true
        }
    },

    // nitro: {
    //     output: {
    //         serverDir: 'foobar'
    //     }
    // }
})
