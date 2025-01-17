const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = "e2963525-8326-4a83-845b-770e14c21a51";

/**
 * @returns {string}
 */

const getAccessToken = () => {
  return localStorage.getItem("token") || "";
};

/**
 * @param {string} endpoint
 * @returns {Promise<any>}
 */
export const apiGet = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}/holidaze${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return response.json();
};

/**
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise<any>}
 */
export const apiPost = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || `Failed to POST: ${response.status}`);
  }

  return response.json();
};

/**
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise<any>}
 */
export const apiPut = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || `Failed to PUT: ${response.status}`);
  }

  return response.json();
};

/**
 * @param {string} endpoint
 * @returns {Promise<any>}
 */
export const apiDelete = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error(`Failed to DELETE: ${response.status}`);
  }
};
