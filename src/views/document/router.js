import Index from './index';

export default [
  {
    path: '/summarize',
    name: 'index',
    component: Index,
    children: [
      {
        path: '/',
        component: () => import('./summarize')
      }
    ]
  }
];