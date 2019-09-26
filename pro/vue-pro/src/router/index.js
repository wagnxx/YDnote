import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Relation from '@/pages/relation';
import SmartSync from '@/pages/smartSync';
import MyPro from '@/pages/smartSync/children/MyPro';
import GroupList from '@/pages/smartSync/children/GroupList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/relation',
      name: 'relation',
      component: Relation
    },
    {
      path: '/smartSync',
      name: 'smartSync',
      component: SmartSync,
      children: [
        {
          path: '',
          redirect: { name: 'groupList' }
        },
        {
          path: 'myPro/:id',
          name: 'myPro',
          component: MyPro
        },
        {
          path: 'groupList',
          name: 'groupList',
          component: GroupList
        }
      ]
    }
  ]
});
