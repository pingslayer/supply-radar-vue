<template>
  <div class="locations container-fluid px-4 py-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom border-secondary border-opacity-50">
      <div>
        <h2 class="h3 text-white fw-bold mb-0">Supply Chain Locations</h2>
        <p class="text-secondary small mb-0">Manage your tracked warehouses, factories, and ports</p>
      </div>
      <div>
        <button class="btn btn-primary fw-medium shadow-sm d-flex align-items-center gap-2" @click="showModal = true">
          <i class="bi bi-plus-lg"></i> Add Location
        </button>
      </div>
    </div>
    
    <div class="card bg-dark border-secondary shadow-lg glass-panel overflow-hidden">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <div class="text-secondary">Loading your supply chain network...</div>
      </div>

      <div v-else-if="locations.length === 0" class="text-center py-5 text-secondary">
        <i class="bi bi-building-slash fs-1 text-muted mb-2 opacity-50"></i>
        <p>No locations mapped yet. Add your first supply location to start monitoring.</p>
      </div>

      <div class="table-responsive" v-else>
        <table class="table table-dark table-hover mb-0 align-middle">
          <thead class="bg-darker text-uppercase small text-secondary" style="letter-spacing: 0.05em;">
            <tr>
              <th scope="col" class="border-secondary border-opacity-50 ps-4 fw-medium">Name</th>
              <th scope="col" class="border-secondary border-opacity-50 fw-medium">Industry</th>
              <th scope="col" class="border-secondary border-opacity-50 fw-medium">Location</th>
              <th scope="col" class="border-secondary border-opacity-50 fw-medium text-end pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="location in locations" :key="location.id" class="border-secondary border-opacity-25 hover-bg-glass">
              <td class="ps-4 py-3">
                <div class="fw-bold text-white mb-1">{{ location.name }}</div>
                <div class="text-secondary small">ID: #{{ location.id }}</div>
              </td>
              <td class="py-3">
                <span class="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50">{{ location.industry }}</span>
              </td>
              <td class="py-3">
                <div class="d-flex align-items-center">
                  <i class="bi bi-globe-americas text-primary me-2"></i>
                  <div>
                    <div class="text-light">{{ location.country }}</div>
                    <div class="text-secondary small" style="font-size: 0.7rem;">
                      {{ location.latitude }}, {{ location.longitude }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3 text-end pe-4">
                <button class="btn btn-sm btn-outline-info border-opacity-50 rounded me-2" @click="editLocation(location)">
                  <i class="bi bi-pencil-square me-1"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger border-opacity-50 rounded" @click="deleteLocation(location.id)" :disabled="deletingId === location.id">
                  <span v-if="deletingId === location.id" class="spinner-border spinner-border-sm me-1" role="status"></span>
                  <i v-else class="bi bi-trash3 me-1"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Location Modal -->
    <div v-if="showModal" class="modal-backdrop fade show" style="background-color: rgba(0,0,0,0.7); backdrop-filter: blur(4px);"></div>
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark border-secondary glass-panel shadow-lg">
          <div class="modal-header border-bottom border-secondary border-opacity-50">
            <h5 class="modal-title text-white fw-bold">
              <i class="bi bi-geo-alt-fill text-primary me-2"></i> 
              {{ editingId ? 'Edit Location' : 'Add New Location' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <div v-if="errorMsg" class="alert alert-danger py-2 px-3 small">{{ errorMsg }}</div>
            
            <form @submit.prevent="submitLocation">
              <div class="mb-3">
                <label for="locName" class="form-label text-light small fw-medium mb-1">Facility Name</label>
                <input type="text" id="locName" class="form-control form-control-sm form-control-dark px-3 py-2" v-model="form.name" required placeholder="Main Warehouse C">
              </div>
              <div class="mb-3">
                <label for="locIndustry" class="form-label text-light small fw-medium mb-1">Industry / Category</label>
                <input type="text" id="locIndustry" class="form-control form-control-sm form-control-dark px-3 py-2" v-model="form.industry" required placeholder="Logistics">
              </div>
              <div class="mb-3">
                <label for="locCountry" class="form-label text-light small fw-medium mb-1">Country (ISO3 code)</label>
                <input type="text" id="locCountry" class="form-control form-control-sm form-control-dark px-3 py-2" v-model="form.country" required minlength="3" maxlength="3" placeholder="USA">
              </div>
              <div class="row gx-3 mb-4">
                <div class="col-6">
                  <label for="locLat" class="form-label text-light small fw-medium mb-1">Latitude</label>
                  <input type="number" step="any" id="locLat" class="form-control form-control-sm form-control-dark px-3 py-2" v-model="form.latitude" required placeholder="34.0522">
                </div>
                <div class="col-6">
                  <label for="locLng" class="form-label text-light small fw-medium mb-1">Longitude</label>
                  <input type="number" step="any" id="locLng" class="form-control form-control-sm form-control-dark px-3 py-2" v-model="form.longitude" required placeholder="-118.2437">
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary ps-4 pe-4" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ editingId ? 'Save Changes' : 'Save Location' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../lib/api';

const locations = ref([]);
const loading = ref(true);

const showModal = ref(false);
const submitting = ref(false);
const errorMsg = ref('');
const deletingId = ref(null);
const editingId = ref(null);

const form = ref({
  name: '',
  industry: '',
  country: '',
  latitude: '',
  longitude: ''
});

const fetchLocations = async () => {
  try {
    const res = await api.get('/supply-locations');
    locations.value = res.data.data || res.data;
  } catch (error) {
    console.error("Failed to fetch locations", error);
  } finally {
    loading.value = false;
  }
};

const submitLocation = async () => {
  submitting.value = true;
  errorMsg.value = '';
  try {
    const payload = {
      ...form.value,
      latitude: parseFloat(form.value.latitude),
      longitude: parseFloat(form.value.longitude),
      country: form.value.country.toUpperCase()
    };
    
    if (editingId.value) {
      await api.put(`/supply-locations/${editingId.value}`, payload);
    } else {
      await api.post('/supply-locations', payload);
    }
    
    closeModal();
    loading.value = true;
    await fetchLocations(); // refresh list
  } catch (error) {
    if (error.response?.data?.errors) {
      errorMsg.value = Object.values(error.response.data.errors).flat().join(' ');
    } else {
      errorMsg.value = error.response?.data?.message || 'Failed to save location.';
    }
  } finally {
    submitting.value = false;
  }
};

const editLocation = (location) => {
  editingId.value = location.id;
  form.value = {
    name: location.name,
    industry: location.industry,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude
  };
  showModal.value = true;
};

const deleteLocation = async (id) => {
  if (!confirm('Are you sure you want to delete this location?')) return;
  
  deletingId.value = id;
  try {
    await api.delete(`/supply-locations/${id}`);
    locations.value = locations.value.filter(loc => loc.id !== id);
  } catch (error) {
    alert('Failed to delete location.');
    console.error(error);
  } finally {
    deletingId.value = null;
  }
};

const closeModal = () => {
  showModal.value = false;
  errorMsg.value = '';
  editingId.value = null;
  form.value = {
    name: '',
    industry: '',
    country: '',
    latitude: '',
    longitude: ''
  };
};

onMounted(() => {
  fetchLocations();
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
.modal {
  display: block; /* Vue handles visibility */
}
</style>
