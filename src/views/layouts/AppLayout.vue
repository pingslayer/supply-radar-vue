<template>
  <div class="d-flex vh-100 bg-dark text-white overflow-hidden">
    <!-- Sidebar -->
    <nav class="sidebar d-flex flex-column flex-shrink-0 pt-4 pb-3 px-3 shadow-lg" style="width: 260px; z-index: 10;">
      <a href="/" class="d-flex align-items-center mb-4 text-white text-decoration-none px-2">
        <div class="bg-primary rounded p-2 me-3 d-flex align-items-center justify-content-center shadow-sm">
          <i class="bi bi-radar fs-5 text-white"></i>
        </div>
        <span class="fs-5 fw-bold tracking-tight">Supply Radar</span>
      </a>
      
      <div class="px-2 mb-2 text-uppercase text-secondary small fw-bold" style="letter-spacing: 0.05em; font-size: 0.75rem;">Main Menu</div>
      <ul class="nav nav-pills flex-column mb-auto gap-1">
        <li class="nav-item">
          <router-link :to="{ name: 'dashboard' }" class="sidebar-link d-flex align-items-center fw-medium" exact-active-class="router-link-active">
            <i class="bi bi-grid-1x2 me-3 fs-5 opacity-75"></i> Dashboard
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'locations' }" class="sidebar-link d-flex align-items-center fw-medium" active-class="router-link-active">
            <i class="bi bi-geo-alt me-3 fs-5 opacity-75"></i> Supply Chain
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'alerts' }" class="sidebar-link d-flex align-items-center fw-medium" active-class="router-link-active">
            <i class="bi bi-bell-fill me-3 fs-5 opacity-75"></i> Risk Alerts
            <!-- Optional badge for future: <span class="badge bg-danger ms-auto rounded-pill">3</span> -->
          </router-link>
        </li>
      </ul>

      <hr class="border-secondary opacity-25">
      
      <div class="dropdown px-2">
        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle rounded p-2 hover-bg-glass" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img :src="`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0d6efd&color=fff&rounded=true&bold=true`" alt="" width="36" height="36" class="rounded-circle me-3 shadow-sm border border-secondary border-opacity-50">
          <div class="d-flex flex-column">
            <span class="small fw-bold">{{ user?.name || 'Loading...' }}</span>
            <span class="text-secondary" style="font-size: 0.75rem;">{{ company?.name || 'Company' }}</span>
          </div>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark shadow-lg border-secondary text-small" aria-labelledby="dropdownUser1">
          <li><a class="dropdown-item py-2" href="#"><i class="bi bi-gear me-2 opacity-50"></i> Settings</a></li>
          <li><hr class="dropdown-divider border-secondary opacity-50"></li>
          <li><a class="dropdown-item py-2 text-danger fw-medium" href="#" @click.prevent="handleLogout"><i class="bi bi-box-arrow-right me-2"></i> Sign out</a></li>
        </ul>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow-1 overflow-auto bg-darker">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const company = computed(() => authStore.company);

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.sidebar-link {
  color: #adb5bd;
  text-decoration: none;
  padding: 0.65rem 1rem;
  display: block;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}
.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.03);
  color: #f8f9fa;
  transform: translateX(2px);
}
.sidebar-link.router-link-active {
  background: linear-gradient(90deg, rgba(13, 110, 253, 0.15) 0%, rgba(13, 110, 253, 0) 100%);
  color: #fff;
  border-left: 3px solid #0d6efd;
  border-radius: 0 0.5rem 0.5rem 0;
}
.hover-bg-glass:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
.bg-darker {
  background-color: #0f0f11 !important;
}
</style>

<style scoped>
/* Scoped styles if needed */
</style>
