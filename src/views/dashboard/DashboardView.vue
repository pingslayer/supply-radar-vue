<template>
  <div class="dashboard container-fluid px-4 py-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom border-secondary border-opacity-50">
      <div>
        <h2 class="h3 text-white fw-bold mb-0">Overview</h2>
        <p class="text-secondary small mb-0">Real-time supply chain monitoring</p>
      </div>
    </div>
    
    <!-- Metrics Row -->
    <div class="row g-4 mb-5">
      <div class="col-md-6 col-lg-4">
        <div class="card bg-dark border-secondary bg-gradient shadow-sm h-100 glass-panel">
          <div class="card-body p-4 d-flex align-items-center">
            <div class="bg-danger bg-opacity-10 text-danger p-3 rounded-circle me-4">
              <i class="bi bi-exclamation-triangle-fill fs-3"></i>
            </div>
            <div>
              <h6 class="card-title text-uppercase text-secondary fw-bold mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">Active Alerts</h6>
              <h2 class="mb-0 text-white fw-bold">
                <span v-if="loadingMetrics" class="spinner-border spinner-border-sm text-secondary" role="status"></span>
                <span v-else>{{ activeAlertsCount }}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card bg-dark border-secondary bg-gradient shadow-sm h-100 glass-panel">
          <div class="card-body p-4 d-flex align-items-center">
            <div class="bg-info bg-opacity-10 text-info p-3 rounded-circle me-4">
              <i class="bi bi-geo-alt-fill fs-3"></i>
            </div>
            <div>
              <h6 class="card-title text-uppercase text-secondary fw-bold mb-1" style="font-size: 0.75rem; letter-spacing: 0.05em;">Tracked Locations</h6>
              <h2 class="mb-0 text-white fw-bold">
                <span v-if="loadingMetrics" class="spinner-border spinner-border-sm text-secondary" role="status"></span>
                <span v-else>{{ locationsCount }}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Disruptions Feed -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 class="text-white fw-bold mb-0">Live Global Disruptions</h4>
      <span v-if="!loadingDisruptions" class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2">
        Page {{ currentPage }} of {{ lastPage }}
      </span>
    </div>
    
    <div class="card bg-dark border-secondary shadow-lg glass-panel overflow-hidden">
      <ul class="list-group list-group-flush" v-if="loadingDisruptions">
        <li class="list-group-item bg-transparent text-secondary py-4 text-center">
          <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
          <div>Scanning global radars...</div>
        </li>
      </ul>
      <ul class="list-group list-group-flush" v-else-if="disruptions.length > 0">
        <li v-for="disruption in disruptions" :key="disruption.id" class="list-group-item bg-transparent border-secondary border-opacity-50 py-3 px-4 hover-bg-glass">
          <div class="d-flex w-100 justify-content-between align-items-center mb-1">
            <h6 class="mb-0 text-white fw-medium">
              <i class="bi bi-lightning-charge-fill text-warning me-2" v-if="disruption.severity === 'high'"></i>
              <i class="bi bi-info-circle-fill text-info me-2" v-else></i>
              {{ disruption.title }}
            </h6>
            <small class="text-secondary text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.05em;">
              {{ disruption.reported_at ? new Date(disruption.reported_at).toLocaleDateString() : 'Just now' }}
            </small>
          </div>
          <p class="mb-1 text-light small opacity-75">{{ disruption.description }}</p>
          <div class="mt-2">
            <span class="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50 me-2">{{ disruption.type }}</span>
            <span :class="['badge border', severityClass(disruption.severity)]">{{ disruption.severity }}</span>
          </div>
        </li>
      </ul>
      <div v-else class="text-center py-5 text-secondary">
        <i class="bi bi-shield-check fs-1 text-success mb-2 opacity-50"></i>
        <p>No active global disruptions found.</p>
      </div>

      <!-- Pagination Footer -->
      <div v-if="disruptions.length > 0 && lastPage > 1" class="card-footer bg-dark border-top border-secondary border-opacity-50 py-3 px-4">
        <div class="d-flex justify-content-between align-items-center">
          <button 
            type="button" 
            class="btn btn-sm btn-outline-secondary d-flex align-items-center" 
            :disabled="currentPage === 1 || loadingDisruptions"
            @click="fetchDisruptions(currentPage - 1)"
          >
            <i class="bi bi-chevron-left me-1"></i> Previous
          </button>
          <span class="text-secondary small">Showing page {{ currentPage }}</span>
          <button 
            type="button" 
            class="btn btn-sm btn-outline-secondary d-flex align-items-center" 
            :disabled="currentPage === lastPage || loadingDisruptions"
            @click="fetchDisruptions(currentPage + 1)"
          >
            Next <i class="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../lib/api';

const activeAlertsCount = ref(0);
const locationsCount = ref(0);
const loadingMetrics = ref(true);

const disruptions = ref([]);
const loadingDisruptions = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);

const fetchMetrics = async () => {
  try {
    // We assume the user has access to these endpoints. 
    // We'll just fetch page 1 and read the `total` from paginated responses.
    const [alertsRes, locationsRes] = await Promise.all([
      api.get('/alerts'),
      api.get('/supply-locations')
    ]);
    
    // Laravel pagination usually returns { data: [...], meta: { total: X } } or { data: [...], total: X }
    activeAlertsCount.value = alertsRes.data.meta?.total || alertsRes.data.total || alertsRes.data.data?.length || 0;
    locationsCount.value = locationsRes.data.meta?.total || locationsRes.data.total || locationsRes.data.data?.length || 0;
  } catch (error) {
    console.error("Failed to fetch metrics", error);
  } finally {
    loadingMetrics.value = false;
  }
};

const fetchDisruptions = async (page = 1) => {
  loadingDisruptions.value = true;
  try {
    const res = await api.get('/disruptions', { params: { page } });
    // Laravel paginator provides data directly in resp.data or resp.data.data
    const responseData = res.data;
    disruptions.value = responseData.data || [];
    currentPage.value = responseData.current_page || 1;
    lastPage.value = responseData.last_page || 1;
  } catch (error) {
    console.error("Failed to fetch disruptions", error);
  } finally {
    loadingDisruptions.value = false;
  }
};

const severityClass = (severity) => {
  if (!severity) return 'bg-secondary text-light border-secondary';
  const s = severity.toLowerCase();
  if (s === 'high' || s === 'critical') return 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-50';
  if (s === 'medium') return 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-50';
  return 'bg-info bg-opacity-10 text-info border-info border-opacity-50';
};

onMounted(() => {
  fetchMetrics();
  fetchDisruptions();
});
</script>

<style scoped>
.hover-bg-glass {
  transition: background-color 0.2s ease;
}
.hover-bg-glass:hover {
  background-color: rgba(255, 255, 255, 0.02) !important;
}
</style>
