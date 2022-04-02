import Control from './index';
import Supplier from './supplier/router';
import Overview from './overview/router';
import User from './user/router';
// import BusinessStatistics from './businessStatistics/router';
import Platform from './paltform/router';

export default [
  {
    path: '/',
    redirect: '/control'
  },
  {
    path: '/control',
    name: 'control',
    component: Control,
    children: [
      ...Supplier,
      ...Overview,
      ...User,
      // ...BusinessStatistics,
      ...Platform
    ]
  }
];
