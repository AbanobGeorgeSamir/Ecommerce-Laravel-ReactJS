
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const slugify = (text) => {
  return text.
    toString().
    toLowerCase().
    trim().
    replace(/\s+/g, '-').
    replace(/[^\w-]+/g, '').
    replace(/--+/g, '-');
};