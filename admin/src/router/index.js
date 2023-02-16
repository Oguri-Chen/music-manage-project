import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/',
    name: '/',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: 'me',
        name: 'me',
        component: () => import('@/views/me/index.vue'),
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/category/index.vue'),
      },
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/message/index.vue'),
      },
      {
        path: 'music',
        name: 'music',
        component: () => import('@/views/music/index.vue'),
      },
      {
        path: 'singer',
        name: 'singer',
        component: () => import('@/views/singer/index.vue'),
      },
      {
        path: 'album',
        name: 'album',
        component: () => import('@/views/album/index.vue'),
      },
      {
        path: 'mv',
        name: 'mv',
        component: () => import('@/views/mv/index.vue'),
      },
      {
        path: 'adminSet',
        name: 'adminSet',
        component: () => import('@/views/admin/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
