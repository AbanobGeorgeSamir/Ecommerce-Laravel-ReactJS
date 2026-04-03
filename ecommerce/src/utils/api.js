const STORAGE_BASE_URL =
  import.meta.env.VITE_STORAGE_URL ||
  import.meta.env.VITE_APP_URL ||
  'http://localhost:8000';

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.orders)) return payload.orders;
  return [];
};

export const normalizeItem = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;
  return payload;
};

export const toCurrency = (value) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numericValue);
};

export const getImageUrl = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') return '';
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  const cleanedPath = value.startsWith('/') ? value.slice(1) : value;
  const storagePath = cleanedPath.startsWith('storage/') ? cleanedPath : `storage/${cleanedPath}`;
  return `${STORAGE_BASE_URL}/${storagePath}`;
};

export const isAdminUser = (user) =>
  user?.is_admin === true || user?.is_admin === 1 || user?.is_admin === '1';
