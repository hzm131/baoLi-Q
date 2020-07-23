import authoritizeRoutes from './routesAuthority.config';

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
    /*  {
        path: '/organ',
        icon: 'export',
        name: 'organ',
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/organ',
            name: 'organList',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/organ',
                redirect: '/organ/list',
              },
              {
                path: '/organ/list',
                name: 'organList',
                component: './Organ/Organ',
              },
              /!*{
                path: '/credit/creditInfo',
                name: 'detail',
                component: './Func/CreditInfo',
              },*!/
            ],
          },
        ]

      },*/
      //授信
      {
        path: '/credit',
        icon: 'setting',
        name: 'credit',
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/credit',
            name: 'creditList',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/credit',
                redirect: '/credit/list',
              },
              {
                path: '/credit/list',
                name: 'creditList',
                component: './Func/Credit',
              },
              {
                path: '/credit/creditInfo/:id',
                name: 'detail',
                component: './Func/CreditInfo',
              },
            ],
          },
        ]

      },
      //支用
      {
        path: '/loan',
        icon: 'file-sync',
        name: 'loan',
        hideChildrenInMenu: true,
        routes:[
          {
            path: '/loan',
            name: 'loanList',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/loan',
                redirect: '/loan/list',
              },
              {
                path: '/loan/list',
                name: 'loanList',
                component: './FuncLoan/Loan',
              },
              {
                path: '/loan/loanInfo/:id',
                name: 'detail',
                component: './FuncLoan/LoanInfo',
              },
            ],
          },
        ]
      },
    ],
  },

];

export default routesConfig;
