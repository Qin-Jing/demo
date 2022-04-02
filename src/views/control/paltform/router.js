export default [
  {
    path: 'platform/monthStatement',
    component: () => import('./businessStatistics/monthTable'),
  },
  {
    path: 'platform/dayStatement',
    component: () => import('./businessStatistics/dayTable'),
  },
  {
    path: 'platform/messageDetail',
    component: () => import('./businessStatistics/messageDetail'),
  },
  {
    path: 'paltform/businessRequest',
    component: () => import('./businessStatistics/businessRequest/manage'),
    children: [
      {
        path: '/',
        component: () => import('./businessStatistics/businessRequest/list')
      },
      {
        path: 'detail',
        component: () => import('./businessStatistics/businessRequest/detail')
      },
    ]
  }
]