const BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  get: (path, options = {}) =>
    fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "GET",
    }),

  post: (path, body, options = {}) => {
    const isFormData = body instanceof FormData;

    return fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "POST",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  put: (path, body, options = {}) => {
    const isFormData = body instanceof FormData;

    return fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "PUT",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  delete: (path, options = {}) =>
    fetch(`${BASE_URL}${path}`, {
      ...options,
      method: "DELETE",
    }),
};
