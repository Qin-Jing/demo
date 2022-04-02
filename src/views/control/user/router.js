export default [
  {
    path: 'user/templateManage',
    component: () => import('./templateManage/index'),
    children: [
      {
        path: '/',
        component: () => import('./templateManage/list')
      },
      {
        path: 'editTemplateName',
        component: () => import('./templateManage/form/templateInfo')
      },
      {
        path: 'editTemplateSource',
        component: () => import('./templateManage/form/templateSource')
      },
      {
        path: 'detail',
        component: () => import('./templateManage/templateDetail')
      }
    ]
  },
  {
    path: 'user/overview',
    component: () => import('./overview/overview'),
  },
  {
    path: 'user/businessStatistics',
    component: () => import('./businessStatistics/index'),
    children: [
      {
        path: 'detail',
        component: () => import('./businessStatistics/detail')
      },
      {
        path: '/',
        component: () => import('./businessStatistics/list'),
        meta: {
          keepAlive: true
        }
      }
    ]
  }
]