import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/pages',
    component: Layout,
    redirect: '/pages/crudTable',
    meta: { title: '信息', icon: 'iconfont icon-shouye' },
    children: [
      {
        path: 'crudTable',
        component: createNameComponent(() => import('@/views/main/map/map.vue')),
        meta: { title: '设备详细信息', cache: false, roles: ['admin', 'editor'] }
      }
    ]
  }
]

export default route