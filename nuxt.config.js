import axios from 'axios'
const bodyParser = require('body-parser')
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: "Kabilesh Blog",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: "This is my Web Development Blog" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap"}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fa923f',height: '6px',duration: 5000 },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/styles/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  env: {
    fbApi: 'AIzaSyA5zE5nlC3N5biUdeL8N0An2R9mUFmM2mY'
  },
  serverMiddleware: [
    bodyParser.json(),
    '~api'
  ],
  generate: {
    routes: function(){
      return axios.get("https://nuxt-app-31525.firebaseio.com/posts.json")
      .then(res=>{
        const routes = []
        for(const key in res.data){
          routes.push('/posts/' + key)
        }
        return routes
      })
    }
  }
}
