<template>
  <div class="alerts container-fluid px-4 py-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom border-secondary border-opacity-50">
      <div>
        <h2 class="h3 text-white fw-bold mb-0">Risk Alerts</h2>
        <p class="text-secondary small mb-0">Disruptions explicitly affecting your supply chain</p>
      </div>
    </div>
    
    <div class="card bg-dark border-secondary shadow-lg glass-panel overflow-hidden">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <div class="text-secondary">Fetching risk alerts...</div>
      </div>
      
      <div v-else-if="alerts.length === 0" class="text-center py-5 text-secondary">
        <i class="bi bi-bell-slash fs-1 text-muted mb-2 opacity-50"></i>
        <p>No active alerts for your current supply locations.</p>
      </div>

      <div class="table-responsive" v-else>
        <table class="table table-dark table-hover mb-0 align-middle">
          <thead class="bg-darker text-uppercase small text-secondary" style="letter-spacing: 0.05em;">
            <tr>
              <th scope="col" class="border-secondary border-opacity-50 ps-4 fw-medium">Risk Event</th>
              <th scope="col" class="border-secondary border-opacity-50 fw-medium">Impact Area</th>
              <th scope="col" class="border-secondary border-opacity-50 fw-medium">Category</th>
              <th scope="col" class="border-secondary border-opacity-50 fw-medium">Risk Score</th>
              <th scope="col" class="border-secondary border-opacity-50 fw-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in alerts" :key="alert.id" class="border-secondary border-opacity-25 hover-bg-glass">
              <td class="ps-4 py-3">
                <div class="fw-bold text-white mb-1">{{ alert.disruption?.title || 'Unknown Event' }}</div>
                <div class="text-secondary small text-truncate" style="max-width: 300px;">
                  {{ alert.disruption?.description || 'No description available' }}
                </div>
              </td>
              <td class="py-3">
                <div class="text-light">
                  <i class="bi bi-geo-alt text-info me-1"></i> {{ alert.disruption?.country || 'Global' }}
                </div>
                <div class="text-secondary small" style="font-size: 0.7rem;" v-if="alert.disruption?.latitude">
                  {{ alert.disruption.latitude }}, {{ alert.disruption.longitude }}
                </div>
              </td>
              <td class="py-3">
                <span class="badge border border-secondary text-secondary bg-transparent">{{ alert.disruption?.type || 'General' }}</span>
              </td>
              <td class="py-3">
                <div class="d-flex align-items-center">
                  <div class="progress me-2 flex-grow-1 bg-secondary bg-opacity-25" style="height: 6px; max-width: 80px;">
                    <div :class="['progress-bar', riskScoreClass(alert.risk_score).bg]" role="progressbar" :style="{ width: alert.risk_score + '%' }" :aria-valuenow="alert.risk_score" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <span :class="['fw-bold', riskScoreClass(alert.risk_score).text]">{{ alert.risk_score }}</span>
                </div>
              </td>
              <td class="py-3">
                <span v-if="alert.status === 'pending'" class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-50">Pending</span>
                <span v-else class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-50 text-uppercase">Sent</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../lib/api';

const alerts = ref([]);
const loading = ref(true);

const fetchAlerts = async () => {
  try {
    const res = await api.get('/alerts');
    alerts.value = res.data.data || res.data;
  } catch (error) {
    console.error("Failed to fetch alerts", error);
  } finally {
    loading.value = false;
  }
};

const riskScoreClass = (score) => {
  if (score >= 80) return { bg: 'bg-danger', text: 'text-danger' };
  if (score >= 50) return { bg: 'bg-warning', text: 'text-warning' };
  return { bg: 'bg-info', text: 'text-info' };
};

onMounted(() => {
  fetchAlerts();
});
</script>

<style scoped>
.bg-darker {
  background-color: #0f0f11 !important;
}
.hover-bg-glass {
  transition: background-color 0.2s ease;
}
.hover-bg-glass:hover {
  background-color: rgba(255, 255, 255, 0.02) !important;
}
</style>
