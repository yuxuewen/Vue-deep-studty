<template>
  <div id="app">
      姓名:{{$store.state.name}}
      年龄:{{$store.getters.getAge}}
      <button @click='testCommit'>提交</button>
      <button @click='testDispatch'>提交</button>
      <router-link to='/home'>首页</router-link>
      <router-link to='/hello'>HELLO</router-link>

      <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  },
  methods:{
    testCommit(){
      this.$store.commit('changeAge',10);
    },
    testDispatch(){
       this.$store.dispatch('asyncChangeAge',10);

    }
  }
}
</script>

<style>

</style>
