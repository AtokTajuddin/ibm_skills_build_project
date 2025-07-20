import api from './api';

export const satuSehatService = {
  // Test SatuSehat API connection
  testConnection: async () => {
    return api.get('/satusehat/test');
  },

  // Get all hospitals in Indonesia
  getAllHospitals: async () => {
    return api.get('/satusehat/hospitals');
  },

  // Get hospitals by region (province/city)
  getHospitalsByRegion: async (province, city) => {
    if (province) {
      return api.get(`/satusehat/hospitals/region/${encodeURIComponent(province)}`);
    }
    return api.get('/satusehat/hospitals');
  },

  // Get hospital details by ID
  getHospitalById: async (hospitalId) => {
    return api.get(`/satusehat/hospitals/${hospitalId}`);
  },

  // Search hospitals by name
  searchHospitals: async (searchTerm) => {
    return api.get(`/satusehat/hospitals?search=${encodeURIComponent(searchTerm)}`);
  }
};
