export default [
  {
    path: 'supplier/template',
    component: () => import('./template/index'),
    children: [
      {
        path: '/',
        component: () => import('./template/list'), 
      },
      {
        path: 'formcontent',
        component: () => import('./template/formContent')
      }
    ]
  },
  {
    path: 'supplier/channel',
    component: () => import('./channel/index'),
    children: [
      {
        path: '/',
        component: () => import('./channel/list'), 
      },
      {
        path: 'formcontent',
        component: () => import('./channel/formContent')
      }
    ]
  },
  {
    path: 'supplier/businessType/:id?',
    props: true,
    component: () => import('./businessType/manage'),
  },
  {
    path: 'supplier/businessDomain',
    component: () => import('./bussinessDomain/manage'),
    children: [
      {
        path: '/',
        component: () => import('./bussinessDomain/list'), 
      },
      {
        path: 'config',
        component: () => import('./bussinessDomain/config'), 
      },
    ]
  },
  {
    path: 'supplier/templateAudit',
    component: () => import('./templateAudit/manage'),
    children: [
      {
        path: '/',
        component: () => import('./templateAudit/list')
      },
      {
        path: 'detail',
        component: () => import('./templateAudit/detail')
      },
      {
        path: 'audit',
        component: () => import('./templateAudit/audit')
      }
    ]
  },
  {
    path: 'supplier/channelType',
    component: () => import('./channelType/manage'),
    children: [
      {
        path: '/',
        component: () => import('./channelType/list')
      },
    ]
  },
  {
    path: 'supplier/terminalChannel',
    component: () => import('./terminalChannel/manage'),
    children: [
      {
        path: '/',
        component: () => import('./terminalChannel/list')
      },
    ]
  },
  {
    path: 'supplier/applicationTerminal',
    component: () => import('./applicationTerminal/manage'),
    children: [
      {
        path: '/',
        component: () => import('./applicationTerminal/list')
      },
      {
        path: 'config',
        component: () => import('./applicationTerminal/config')
      },
    ]
  },
  {
    path: 'supplier/messageGroup',
    component: () => import('./messageGroup/manage'),
    children: [
      {
        path: 'list',
        component: () => import('./messageGroup/list'),
      },
      {
        path: 'channel',
        component: () => import('./messageGroup/channel'),
      },
      {
        path: 'app',
        component: () => import('./messageGroup/app'),
      },
      {
        path: '/',
        redirect: 'list'
      },
    ]
  }
]