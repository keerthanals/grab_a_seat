const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('Making request to:', `${API_BASE_URL}${url}`);
  console.log('Request config:', config);

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    console.error('Request failed:', error);
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
};

// Helper function for FormData requests (file uploads)
const makeFormDataRequest = async (url, formData, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    method: 'POST',
    body: formData,
    ...options,
  };

  console.log('Making FormData request to:', `${API_BASE_URL}${url}`);

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  console.log('FormData response status:', response.status);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    console.error('FormData request failed:', error);
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
};

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    return makeAuthenticatedRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return makeAuthenticatedRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return makeAuthenticatedRequest('/user/logout');
  },

  getProfile: async () => {
    return makeAuthenticatedRequest('/user/profile');
  },

  updateProfile: async (userData) => {
    return makeAuthenticatedRequest('/user/profile-update', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },
};

// Admin API functions
export const adminAPI = {
  approveRejectTheatre: async (theatreId, action, rejectionReason = '') => {
    return makeAuthenticatedRequest(`/admin/theatres/${theatreId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action, rejectionReason }),
    });
  },

  approveRejectAdmin: async (userId, action, rejectionReason = '') => {
    return makeAuthenticatedRequest(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action, rejectionReason }),
    });
  },

  getPendingAdmins: async () => {
    return makeAuthenticatedRequest('/admin/pending-admins');
  },

  getAllTheatres: async () => {
    return makeAuthenticatedRequest('/admin/theatre-list');
  },

  getAllMovies: async () => {
    return makeAuthenticatedRequest('/admin/movie-list');
  },

  getAllBookings: async () => {
    return makeAuthenticatedRequest('/bookings/all-bookings');
  },

  getAllUsers: async () => {
    return makeAuthenticatedRequest('/admin/users');
  },

  deleteUser: async (userId) => {
    return makeAuthenticatedRequest(`/user/delete/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Owner API functions
export const ownerAPI = {
  createTheatre: async (theatreData) => {
    return makeAuthenticatedRequest('/owner', {
      method: 'POST',
      body: JSON.stringify(theatreData),
    });
  },

  addMovie: async (movieFormData) => {
    return makeFormDataRequest('/owner/movies', movieFormData);
  },

  getOwnerTheatres: async () => {
    return makeAuthenticatedRequest('/owner/my-theatres');
  },

  createShow: async (showData) => {
    return makeAuthenticatedRequest('/owner/shows', {
      method: 'POST',
      body: JSON.stringify(showData),
    });
  },

  getOwnerBookings: async () => {
    return makeAuthenticatedRequest('/bookings/owner-bookings');
  },
};

// User/Booking API functions
export const bookingAPI = {
  createBooking: async (bookingData) => {
    return makeAuthenticatedRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
};

// Review API functions
export const reviewAPI = {
  addReview: async (reviewData) => {
    return makeAuthenticatedRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getMovieReviewsByOwner: async (movieId) => {
    return makeAuthenticatedRequest(`/reviews/owner/${movieId}`);
  },

  deleteReviewByAdmin: async (reviewId) => {
    return makeAuthenticatedRequest(`/reviews/admin/${reviewId}`, {
      method: 'DELETE',
    });
  },

  getAllReviewsByAdmin: async (movieId) => {
    return makeAuthenticatedRequest(`/reviews/admin/${movieId}`);
  },
};

// Public API functions (no auth required but still use the helper for consistency)
export const publicAPI = {
  getAllMovies: async () => {
    return makeAuthenticatedRequest('/admin/movie-list');
  },

  getAllTheatres: async () => {
    return makeAuthenticatedRequest('/admin/theatre-list');
  },
};

export default {
  authAPI,
  adminAPI,
  ownerAPI,
  bookingAPI,
  reviewAPI,
  publicAPI,
};