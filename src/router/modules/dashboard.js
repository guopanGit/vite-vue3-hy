import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/home',
    component: Layout,
    redirect: '/home/list1',
    meta: { title: '设备组列表', icon: 'iconfont icon-shouye' },
    children: [
      {
        path: 'list1',
        component: createNameComponent(() => import('@/views/main/home/index.vue')),
        meta: { title: '设备组1', icon: 'iconfont icon-shebei', hideClose: true }
      },
      {
        path: 'list2',
        component: createNameComponent(() => import('@/views/main/home/index2.vue')),
        meta: { title: '设备组2', icon: 'iconfont icon-shebei', hideClose: true }
      },
    ]
  },
/*  {
    path: '/home',
    component: Layout,
    redirect: '/home/data',
    meta: { title: '设备', icon: 'iconfont icon-shouye' },
    children: [
      {
        path: 'data',
        component: createNameComponent(() => import('@/views/main/home/details.vue')),
        meta: { title: '设备运行数据', icon: 'iconfont icon-shujuwajue', hideClose: true }
      }
    ]
  }*/
]

export default route