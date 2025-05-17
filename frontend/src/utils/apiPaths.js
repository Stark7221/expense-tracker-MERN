export const BASE_URL = "http://localhost:5000";

//utils/aptiAuth.js
export const API_PATHS = {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      LOGOUT: '/api/v1/auth/logout',
      PROFILE: '/api/v1/auth/profile'
    },
    DASHBOARD: {
      GET_DATA: '/api/v1/dashboard'
    },
    INCOME: {
      CREATE: '/api/v1/income/add',
      GET_ALL: '/api/v1/income/get',
      GET_ONE: (id) => `/api/v1/income/${id}`,
      UPDATE: (id) => `/api/v1/income/${id}`,
      DELETE: (id) => `/api/v1/income/${id}`,
      DOWNLOAD_INCOME: "/api/v1/income/downloadexcel",
    },
    EXPENSE: {
      CREATE: '/api/v1/expense/add',
      GET_ALL: '/api/v1/expense/get',
      GET_ONE: (id) => `/api/v1/expense/${id}`,
      UPDATE: (id) => `/api/v1/expense/${id}`,
      DELETE: (id) => `/api/v1/expense/${id}`,
      DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
    },
    IMAGE: {
      UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },
  };
  