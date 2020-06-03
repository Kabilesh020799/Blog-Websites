import Vuex from 'vuex'
import axios from 'axios'
import Cookie from 'js-cookie'
const createStore = () =>{
    return new Vuex.Store({
        state: {
            loadedPosts: [],
            token: null
        },
        mutations: {
            setPosts(state,posts) {
                state.loadedPosts = posts
            },
            addPost(state,post){
                state.loadedPosts.push(post)
            },
            editPost(state,editedPost){
                const postIndex = state.loadedPosts.findIndex(
                    post=>post.id === editedPost.id
                )
                state.loadedPosts[postIndex] = editedPost
            },
            StoreToken(state,token){
                state.token = token
            },
            ClearToken(state){
                state.token = null
            }
        },
        actions: {
            nuxtServerInit(vuexContext,context){
              return axios.get("https://nuxt-app-31525.firebaseio.com/posts.json")
               .then(res=>{
                   const postArray = []
                   console.log(res)
                   for (const key in res.data){
                    postArray.push({...res.data[key],id: key})
                   }
               vuexContext.commit('setPosts',postArray)
            })
            .catch(err=>console.log(err))
            },
            setPosts(vuexContext,posts){
                vuexContext.commit('setPosts',posts)
            },
            addPost(vuexContext,post){
                const createdPost = {
                    ...post,
                    updatedDate: new Date()
                }
                return axios.post('https://nuxt-app-31525.firebaseio.com/posts.json?auth=' + vuexContext.state.token,createdPost)
                .then(res=>{
                    vuexContext.commit('addPost',{...createdPost,id: res.data.name})
                })
            },
            editPost(vuexContext,editedPost){
                return axios.put("https://nuxt-app-31525.firebaseio.com/posts/" + editedPost.id + '.json?auth=' + vuexContext.state.token,editedPost)
                .then(res=>{
                    vuexContext.commit('editPost',editedPost)
                })
                .catch(err=>console.log(err))
            },
            authenticateUser(vuexContext,appData){
                let Url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.fbApi
                if(!appData.isLogin)
                {
                    Url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + process.env.fbApi
                }
                return axios.post(Url,{
                email: appData.email,
                password: appData.password,
                returnSecureToken: true
                })
                .then(res=>{
                    vuexContext.commit('StoreToken',res.data.idToken)
                    localStorage.setItem('token',res.data.idToken)
                    localStorage.setItem('tokenExpiration',new Date().getTime() + +res.data.expiresIn*1000)
                    Cookie.set('token',res.data.idToken)
                    Cookie.set('expirationDate', new Date().getTime() + +res.data.expiresIn*1000)
                })
                .catch(res=>console.log(res))
            },
            initAuth(vuexContext,req){
                let token
                let expirationDate
                if(req){
                    if(!req.headers.cookie){
                        return;
                    }
                    const jwtCookie = req.headers.cookie.split(';').find(c=>c.trim().startsWith("jwt="))
                    if(!jwtCookie)
                    {
                        return;
                    }
                     token = jwtCookie.split("=")[1]
                     expirationDate = req.headers.cookie.split(';').find(c=>c.trim().startsWith("expirationDate=")).split("=")[1]
                }
                else if(process.client){
                     token = localStorage.getItem('token');
                     expirationDate = localStorage.getItem('tokenExpiration')
                }
                if(new Date().getTime() > +expirationDate || !token)
                {
                    console.log("No Token or Clear Token")
                    vuexContext.commit('logout')
                    return;
                }
                vuexContext.commit('StoreToken',token)
            },
            logout(vuexContext){
                vuexContext.commit("ClearToken")
                localStorage.removeItem('token')
                localStorage.removeItem('tokenExpiration')
                if(process.client){
                    Cookie.remove('token')
                    Cookie.remove('expirationDate') 
                }
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts
            },
            isAuth(state){
                return state.token != null
            }
        }
    })
}

export default createStore