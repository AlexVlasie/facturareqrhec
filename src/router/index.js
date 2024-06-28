import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import QrCodeGenerator from '@/components/QrCodeGenerator.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/qr-code-generator',
    name: 'QrCodeGenerator',
    component: QrCodeGenerator
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
