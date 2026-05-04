const ENV = {
  local: 'http://localhost/api/integration/v1',
  production: 'https://api.proextend.com.br/integration/v1',
};

export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development')
    ? ENV.local
    : ENV.production;

export default API_BASE_URL;