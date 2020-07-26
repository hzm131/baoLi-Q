const routesConfig = [
  // user
  {
    path: '/user',
    // component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      // { path: '/user/register', component: './User/Register' },
      // { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 管理员 dashboard
      {
        path: '/credit/list',
        component: './Func/Credit',
      },
      //机构
      {
        path: '/organ',
        icon: 'export',
        name: 'organ',
        authority: ['admin'],
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/organ',
            redirect: '/organ/list',
          },
          {
            path: '/organ/list',
            name: 'organList',
            component: './Organ/Organ',
            authority: ['admin'],
          }
        ]
      },
      //授信
      {
        path: '/credit',
        icon: 'setting',
        name: 'credit',
        authority: ['admin','creditQuery'],
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/credit',
            redirect: '/credit/list',
          },
          {
            path: '/credit/list',
            name: 'creditList',
            component: './Func/Credit',
            authority: ['admin','creditQuery'],
          },
          {
            path: '/credit/creditInfo/:id',
            name: 'detail',
            component: './Func/CreditInfo',
            authority: ['admin','creditQuery'],
          },
        ]
      },
      //支用
      {
        path: '/loan',
        icon: 'file-sync',
        name: 'loan',
        authority: ['admin','loanQuery'],
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/loan',
            redirect: '/loan/list',
          },
          {
            path: '/loan/list',
            name: 'loanList',
            authority: ['admin','loanQuery'],
            component: './FuncLoan/Loan',
          },
          {
            path: '/loan/loanInfo/:id',
            name: 'detail',
            authority: ['admin','loanQuery'],
            component: './FuncLoan/LoanInfo',
          },
        ]
      },
    ],
  },

];

export default routesConfig;
