
const forEach=(obj,callBack)=>
{
    if(typeof obj!=='object' || obj===null)
    {
        return [];
    }
    Object.keys(obj).forEach(key=>{
          callBack(key,obj[key])
    });
}

class ModuleCollection{
     constructor(options){
         this.root={};
          
           this.register([],options);

     }
     register(path,rootModule){
        let newModule={
            state:rootModule.state,
            _children:{},
            _raw:rootModule
      }
      if(path.length===0)
      {
          this.root=newModule      
      }
      else{
          //console.log(path.splice(0,-1));
          console.log(path);
          let parent=path.splice(0,-1).reduce((root,cur)=>{
                return root._children[cur];
          },this.root);
       
          parent._children[path.length-1]=newModule;

      }

      if(rootModule.modules)
      {
         
          forEach(rootModule.modules,(key,module)=>{
              this.register(path.concat(key),module);

           })
      }


        

     }

}

const installModules=(store,state,path,rootModule)=>{
    //modules 中的 state 的处理
     if(path.length>0)
     {
         let parent=path.slice(0,-1).reduce((state,cur)=>{
             return state[cur];

         },state);
         
         Vue.set(parent,path[path.length-1],rootModule.state);
     }

    //处理getter
     let getters=rootModule._raw.getters;
     forEach(getters,(name,fn)=>{

        Object.defineProperty(store.getters,name,{
              get(){
                    return fn.call(this,rootModule.state);
              }
        });

     })
     //处理 mutation

     let mutations=rootModule._raw.mutations||{};
     forEach(mutations,(name,fn)=>{
            let arr=store.mutations[name] || (store.mutations[name]=[]);
           arr.push((...params)=>{
               fn.call(this,rootModule.state,...params);

           })
     })

      //处理 mutation

      let actions=rootModule._raw.actions ||{};
      forEach(actions,(type,fn)=>{
             let arr=store.actions[type] || (store.actions[type]=[]);
            arr.push((...params)=>{
                fn.call(this,rootModule.state,...params);
 
            })
      })
    //递归安装子modules
    forEach(rootModule._children,(name,module)=>{
          installModules(store,state,path.concat(name),module)
    })

};

let Vue=null;
class Store{
    constructor(options)
    {
        //state 将state 数据设置为响应式
        //this.state=options.state ||{}
        this._vm=new Vue({
              data:options.state
        })
        // //设置 getters
        // let getters=options.getters ||{};
        // this.getters={};

        // forEach(getters,(key,fn)=>{
        //       Object.defineProperty(this.getters,key,{
        //           get:()=>{
        //                 return fn.call(this,this.state);
        //           }
        //       })
        // })
        // //设置 mutations 依赖于 订阅 发布模式 

        this.mutations={};
        this.getters={};
        // this.mutations={};
        // forEach(mutations,(key,fn)=>{
            
        //      this.mutations[key]=(params)=>{
        //           fn.call(this,this.state,params);
        //      }

        // })
        // //配置 action

        // this.actions={};
          this.actions={};
        
        // forEach(actions,(key,fn)=>{
        //     this.actions[key]=(params)=>{
        //         fn.call(this,this.state,params);
        //    }
           

        // })
        //对 modules 进行收集
        var modules=new ModuleCollection(options);
      
        installModules(this,options.state,[],modules.root);
        console.log(this);






    }
    get state(){
       return  this._vm

    }

    commit=(name,...params)=>{
        console.log(this.mutations[name]);
        this.mutations[name].forEach(fn=>{
              fn(...params)
        })
       // this.mutations[name](params)

    }
    dispatch=(type,...params)=>{
        this.actions[type].forEach(fn=>{
            fn(...params)
      })
       // this.actions[type](params);

    }

}
// class Store{
//     constructor(options)
//     {
//         //state 将state 数据设置为响应式
//         //this.state=options.state ||{}
//         this._vm=new Vue({
//               data:options.state
//         })
//         //设置 getters
//         let getters=options.getters ||{};
//         this.getters={};

//         forEach(getters,(key,fn)=>{
//               Object.defineProperty(this.getters,key,{
//                   get:()=>{
//                         return fn.call(this,this.state);
//                   }
//               })
//         })
//         //设置 mutations 依赖于 订阅 发布模式 

//         let mutations=options.mutations||{};
//         this.mutations={};
//         forEach(mutations,(key,fn)=>{
            
//              this.mutations[key]=(params)=>{
//                   fn.call(this,this.state,params);
//              }

//         })
//         //配置 action

//         this.actions={};
//         let actions=options.actions ||{};
        
//         forEach(actions,(key,fn)=>{
//             this.actions[key]=(params)=>{
//                 fn.call(this,this.state,params);
//            }
           

//         })
//         //对 modules 进行收集

//         var modules=new ModuleCollection(options);
//         console.log(modules);





//     }
//     get state(){
//        return  this._vm

//     }

//     commit=(name,params)=>{
//         this.mutations[name](params)

//     }
//     dispatch=(type,params)=>{
//         this.actions[type](params);

//     }

// }



//安装的方法
const install=(_Vue)=>{
   Vue=_Vue;
  //为每个组件注入
  Vue.mixin({
       
        beforeCreate(){
            //说明是根
            if(this.$options && this.$options.store)
            {
                this.$store=this.$options.store;

            }
            else{
                this.$store=this.$parent && this.$parent.$store;
            }


        }
  })

}
export default{
     install,
     Store
}