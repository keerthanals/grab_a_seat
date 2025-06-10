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

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
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

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
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
  approveRejectTheatre: async (theatreId, action) => {
    return makeAuthenticatedRequest(`/admin/theatres/${theatreId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action }), // 'approve' or 'reject'
    });
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