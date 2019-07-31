export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: '登录', component: './User/Login' },
      { path: '/user/register', name: '注册', component: './User/Register' },
      { path: '/user/foregetpwd', component: './User/Forgetpwd' },
      {
        path: '/user/register-result',
        name: '注册结果',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/sourcemanage/Center', authority: ['personal', 'cpuser', 'attchuser'] },
      {
        path: '/sourcemanage',
        name: '房源管理',
        icon: 'form',
        routes: [
          {
            path: '/sourcemanage/Center',
            name: '房源管理 ',
            component: './SourceManage/Center',
          },
          {
            path: '/sourcemanage/setting',
            name: '房源配置',
            component: './SourceManage/setting',
          },
          {
            path: '/sourcemanage/AddHouse',
            name: '添加房源',
            component: './SourceManage/AddHouse',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/sourcemanage/AddHouse',
                redirect: '/sourcemanage/AddHouse/info',
              },
              {
                path: '/sourcemanage/AddHouse/info',
                name: '填写基本信息',
                component: './SourceManage/AddHouse/Step1',
              },
              {
                path: '/sourcemanage/AddHouse/confirm',
                name: '填写房间信息',
                component: './SourceManage/AddHouse/Step2',
              },
              {
                path: '/sourcemanage/AddHouse/result',
                name: '结果页',
                component: './SourceManage/AddHouse/Result',
              },
            ],
          },
        
          {
            path:"/sourcemanage/EditPage",
            name:"编辑",
            hideInMenu:true,
            component: './SourceManage/EditPage',
            routes:[
              {
                path: '/sourcemanage/EditPage/rent',
                name: '租约信息',
                component: './SourceManage/EditPage/Rent'
              },
              {
                path: '/sourcemanage/EditPage/room',
                name: '编辑房源',
                component: './SourceManage/EditPage/Room'
              }
            ]
          }
        ],
      },
      {
        path: '/RentManage',
        name: '租赁管理',
        icon: 'dashboard',
        routes: [
          // {
          //   path: '/rentmanage/addpreorder',
          //   name: '租赁管理',
          //   key:1,
          //   component: './RentManage/AddPreseting',
          // },
          {
            path: '/rentmanage/addpreorder',
            name: '添加预定',
              key:2,
            component: './RentManage/AddPreseting',
          },
          {
            path: '/rentmanage/addrenter',
            name: '添加租赁',
            component: './RentManage/AddRenter',
          },
        ],
      },
      {
        path: '/form',
        icon: 'form',
        name: '财务管理',
        routes: [
          {
            path: '/form/basic-form',
            name: '财务概览',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: '新增账务',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/configCenter',
        icon: 'table',
        name: '配置中心',
        routes: [

          {
            path: '/configCenter/configCharge',
            name: '收费项目',
            component: './ConfigCenter/ConfigCharge',
          }
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: '个人中心',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: '个人信息',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
