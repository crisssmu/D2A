export const isRoundedDivi = (value: number, quantity: number): number =>
  (value / quantity) % 1 < 0.8 && (value / quantity) % 1 !== 0
    ? parseFloat((value / quantity).toFixed(2))
    : Math.round(value / quantity);

export const isRoundedMult = (value: number, quantity: number): number =>
  (value * quantity) % 1 < 0.8 && (value * quantity) % 1 !== 0
    ? parseFloat((value * quantity).toFixed(2))
    : Math.round(value * quantity);

export const calculePurchasePrice = (gross_price: number, tax: number, ico: number, quantity: number) => {
  if(quantity === 0) return 0;
  const purchasePrice = (gross_price * quantity + gross_price * tax * quantity + ico * quantity);
  const purchasePriceUnit = isRoundedDivi(purchasePrice, quantity);
  return purchasePriceUnit;
}