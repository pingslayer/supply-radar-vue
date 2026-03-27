<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-dark py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-7 col-xl-6">
          
          <div class="text-center mb-4">
            <i class="bi bi-radar text-primary" style="font-size: 2.5rem;"></i>
            <h2 class="text-white mt-2 mb-1 fw-bold">Join Supply Radar</h2>
            <p class="text-secondary small">Monitor your global supply chain in real-time</p>
          </div>

          <div class="card bg-dark border-secondary shadow-lg glass-panel">
            <div class="card-body p-4">
              <div v-if="error" class="alert alert-danger py-2 px-3 small" role="alert">
                {{ error }}
              </div>

              <form @submit.prevent="handleRegister">
                <div class="row gx-3">
                  <div class="col-sm-6 mb-3">
                    <label for="company_name" class="form-label text-light small fw-medium mb-1">Company Name</label>
                    <input type="text" class="form-control form-control-sm form-control-dark px-3 py-2" id="company_name" v-model="form.company_name" required placeholder="Acme Corp">
                  </div>
                  <div class="col-sm-6 mb-3">
                    <label for="user_name" class="form-label text-light small fw-medium mb-1">Your Name</label>
                    <input type="text" class="form-control form-control-sm form-control-dark px-3 py-2" id="user_name" v-model="form.user_name" required placeholder="Jane Doe">
                  </div>
                  <div class="col-sm-6 mb-3">
                    <label for="email" class="form-label text-light small fw-medium mb-1">Work Email</label>
                    <input type="email" class="form-control form-control-sm form-control-dark px-3 py-2" id="email" v-model="form.email" required placeholder="name@company.com">
                  </div>
                  <div class="col-sm-6 mb-4">
                    <label for="password" class="form-label text-light small fw-medium mb-1">Password</label>
                    <input type="password" class="form-control form-control-sm form-control-dark px-3 py-2" id="password" v-model="form.password" required minlength="8" placeholder="••••••••">
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-100 fw-medium" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Create Account
                </button>
                
                <div class="text-center mt-3 pt-2 border-top border-secondary opacity-75">
                  <span class="text-light small">Already have an account? </span>
                  <router-link :to="{ name: 'login' }" class="text-info text-decoration-none small fw-medium">Sign In</router-link>
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
  company_name: '',
  user_name: '',
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.register(form.value);
    router.push({ name: 'dashboard' });
  } catch (err) {
    if (err.response?.data?.errors) {
      const messages = Object.values(err.response.data.errors).flat();
      error.value = messages.join(' ');
    } else {
      error.value = err.response?.data?.message || 'Registration failed.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
