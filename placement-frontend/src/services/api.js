import apiClient from './apiClient';

// ==================== AUTH SERVICES ====================
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getMe: () => apiClient.get('/auth/me'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (email, token, password) => apiClient.post('/auth/reset-password', { email, token, password }),
};

// ==================== STUDENT SERVICES ====================
export const studentAPI = {
  getDashboard: () => apiClient.get('/student/dashboard'),
  getProfile: () => apiClient.get('/student/profile'),
  updateProfile: (data) => apiClient.put('/student/profile', data),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return apiClient.post('/student/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getPlacementDrives: () => apiClient.get('/student/drives'),
  applyForDrive: (driveId) => apiClient.post('/student/apply', { driveId }),
  getApplications: () => apiClient.get('/student/applications'),
  getInterviews: () => apiClient.get('/student/interviews'),
};

// ==================== COMPANY SERVICES ====================
export const companyAPI = {
  getDashboard: () => apiClient.get('/company/dashboard'),
  createDrive: (data) => apiClient.post('/company/drives', data),
  getDrives: () => apiClient.get('/company/drives'),
  getApplicants: () => apiClient.get('/company/applicants'),
  getShortlisted: () => apiClient.get('/company/shortlisted'),
  updateApplicationStatus: (applicationId, status) => apiClient.patch(`/company/applications/${applicationId}/status`, { status }),
  scheduleInterview: (data) => apiClient.post('/company/interviews', data),
  getInterviews: () => apiClient.get('/company/interviews'),
};

// ==================== TPO SERVICES ====================
export const tpoAPI = {
  getDashboard: () => apiClient.get('/tpo/dashboard'),
  getStudents: () => apiClient.get('/tpo/students'),
  getCompanies: () => apiClient.get('/tpo/companies'),
  getDrives: () => apiClient.get('/tpo/drives'),
  getInterviews: () => apiClient.get('/tpo/interviews'),
  generateReports: () => apiClient.get('/tpo/reports'),
};

// ==================== ADMIN SERVICES ====================
export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getStudents: () => apiClient.get('/admin/students'),
  getCompanies: () => apiClient.get('/admin/companies'),
  verifyCompany: (companyId) => apiClient.post('/admin/verify-company', { companyId }),
  getDrives: () => apiClient.get('/admin/drives'),
  getInterviews: () => apiClient.get('/admin/interviews'),
  generateReports: () => apiClient.get('/admin/reports'),
};
