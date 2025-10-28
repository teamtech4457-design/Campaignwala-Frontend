import api from './api';

const leadService = {
  // Get all leads
  getAllLeads: async (params = {}) => {
    try {
      const response = await api.get('/leads', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get lead by ID
  getLeadById: async (id) => {
    try {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new lead (from shared link)
  createLead: async (leadData) => {
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update lead status
  updateLeadStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/leads/${id}`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete lead
  deleteLead: async (id) => {
    try {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get lead statistics
  getLeadStats: async (hrUserId = null) => {
    try {
      const params = hrUserId ? { hrUserId } : {};
      const response = await api.get('/leads/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve lead
  approveLead: async (id) => {
    try {
      const response = await api.post(`/leads/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject lead
  rejectLead: async (id, rejectionReason = '') => {
    try {
      const response = await api.post(`/leads/${id}/reject`, { rejectionReason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default leadService;
