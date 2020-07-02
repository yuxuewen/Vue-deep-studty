import Vue from 'vue'
import Vuex from '../vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      name:'yxw',
      age:10
  },

  modules:{
       a:{
           state:{
               s:3
           },
           actions:{
            add(type,params){
               
            }
          },
           modules:{
             c:{
                 state:{},
                 modules:{
                     state:{

                     }
                 }
             }

           }
       },
       b:{
         state:{}

       },
       f:{
         state:{},
         modules:{
             state:{

             }
         }
       }
  },
  mutations: {
    changeAge(state,params)
    {
        state.age=state.age+params;
        state.name=state.name+'测试的是mutations'
    }
  },
  actions: {
      asyncChangeAge(state,params){
        setTimeout(()=>{
            state.age=state.age+params;
            state.name=state.name+'测试的是actions'
        },1000)

      }
  },

  getters: {

    
    getAge:function(state)
    {
        return state.age+10;
    }

    
  
      
  },
  
})
