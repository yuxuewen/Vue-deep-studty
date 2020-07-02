
const HASH='hash',HISTORY='history';
class History{
    constructor(current){
        this.current=current||'/home';

    }
}
class VueRouter{
     
    constructor(options){
        //模式

        this.mode=options.mode ||HASH;
        let routes=options.routes || [];
        this.routesMap=this.handleRoutes(routes);
        this.history=new History();
        this._init();


    }
    /**
     * 初始化
     */
    _init(){
        if(this.mode===HASH)
        {
            location.hash?'':location.hash='#/';
            //hash chanage
            window.addEventListener('hashchange',()=>{
             
                 
                this.history.current=location.hash.slice(1);
              

                  
            })
            window.addEventListener('load',()=>{
                this.history.current=location.hash.slice(1);

            })

        }
        else if(this.mode===HISTORY)
        {
            location.pathname?'':location.pathname='/'
              window.addEventListener('popstate',()=>{
                 
                this.history.current=location.pathname;

                  
            })
            window.addEventListener('load',()=>{
                this.history.current=location.pathname;

            })

        }

    }

    handleRoutes(routes){

        var routesMap=routes.reduce((res,current)=>{
         
                res[current.path]=current.component;
                return res;
              

        },{});
        console.log(routesMap);
         return routesMap;

    }
  
}
/**
 * 安装
 * @param {*} Vue 
 */
VueRouter.install=(Vue)=>{
    
    Vue.mixin({
        beforeCreate(){
              //获得唯一的 router 实例
              //跟组件
                if(this.$options && this.$options.router)
                {
                    this._root=this.$options.router ||{};
                       // 将 _route 添加监听，当修改 history.current 时就可以触发更新了
                    
                     Vue.util.defineReactive(this, '_route', this._root.history)
                }
                else{
                    //子组件
                    
                    this._root=this.$parent && this.$parent._root||{};
                }
                console.log(this._root);
                Object.defineProperty(this,'$routes',{
                    get(){
                        return this._self._root
                    }

                })
                Object.defineProperty(this,'$route',{
                    get(){
                        return this._self._root.history.current;
                    }
                })

                }
            })
  

    //路由跳转

    Vue.component('router-link',{
          props:{
                to:String,
                required:true
          },
          render(h)
          {
               let mode=this._self._root.mode,to=this.to;
          return <a href={mode===HASH?`#${to}`:to}>{this.$slots.default}</a>
          }
     })
     //注册路由容器组件
     Vue.component('router-view',{
        render(h)
        {
            console.log(this._self)
            let current=this._self._root.history.current;
        
            if(!current)
            {
                return;
            }
            
            let component=this._self._root.routesMap[current];
             return h(component)
        }
   })



}
export default VueRouter;