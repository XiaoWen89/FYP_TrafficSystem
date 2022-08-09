export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        name: 'registration',
        path: '/user/registration',
        component: './Registration',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    //access: 'admin',
    routes: [
      {
        path: '/dashboard/monitor',
        name: 'Monitoring',
        icon: '',
        component: './Admin',
      },
      {
        path: '/dashboard/prediction',
        name: 'Prediction',
        icon: '',
        component: './Prediction',
      },
      {
        path: '/dashboard/roadWork',
        name: 'Roadwork Advice',
        icon: '',
        component: './roadWork',
      },
      {
        path: '/dashboard/forcasting',
        name: 'forcasting',
        icon: '',
        component: './forcasting',
      },
      {
        path: '/dashboard/reporting',
        name: 'reporting',
        icon: '',
        component: './reporting',
        access:'canAdmin'
      },
      {
        component: './404',
      },
    ],
  },
  /*
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },*/
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
