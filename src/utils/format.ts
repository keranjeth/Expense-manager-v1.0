export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^\d.-]/g, ''));
};