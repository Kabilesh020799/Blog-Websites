<template>
    <div class="admin-post-page">
        <section class="update-form">
            <AdminPostForm :post="loadedPost" @submit="OnSubmitted"/>
        </section>
    </div>
</template>
<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
import axios from 'axios'
export default {
    components:{
        AdminPostForm
    },
    middleware: ['auth','check-auth'],
    asyncData(context){
        return axios.get('https://nuxt-app-31525.firebaseio.com/posts/' + context.params.postId + '.json')
        .then(res=>{
            return{
                loadedPost: {...res.data,id: context.params.postId}
            }
        })
        .catch(e=>console.log(e))
    },
    methods:{
        OnSubmitted(editedPost){
            this.$store.dispatch('editPost',editedPost)
            .then(()=>{
                this.$router.push('/admin')
            })
        }
    }   
}
</script>
<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>