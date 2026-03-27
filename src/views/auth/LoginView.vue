<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-dark py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          
          <div class="text-center mb-4">
            <i class="bi bi-radar text-primary" style="font-size: 2.5rem;"></i>
            <h2 class="text-white mt-2 mb-1 fw-bold">Supply Radar</h2>
            <p class="text-secondary small">Access your control panel</p>
          </div>

          <div class="card bg-dark border-secondary shadow-lg glass-panel">
            <div class="card-body p-4">
              <div v-if="error" class="alert alert-danger py-2 px-3 small" role="alert">
                {{ error }}
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label text-light small fw-medium mb-1">Email address</label>
                  <input 
                    type="email" 
                    class="form-control form-control-sm form-control-dark px-3 py-2" 
                    id="email" 
                    v-model="form.email" 
                    required 
                    placeholder="name@company.com"
                  >
                </div>
                <div class="mb-4">
                  <label for="password" class="form-label text-light small fw-medium mb-1">Password</label>
                  <input 
                    type="password" 
                    class="form-control form-control-sm form-control-dark px-3 py-2" 
                    id="password" 
                    v-model="form.password" 
                    required
                    placeholder="••••••••"
                  >
                </div>
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 fw-medium" 
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sign In
                </button>
                
                <div class="text-center mt-3 pt-2 border-top border-secondary opacity-75">
                  <span class="text-light small">New to Supply Radar? </span>
                  <router-link :to="{ name: 'register' }" class="text-info text-decoration-none small fw-medium">Create an account</router-link>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login(form.value);
    router.push({ name: 'dashboard' });
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>
