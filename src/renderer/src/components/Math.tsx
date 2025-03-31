export function calculateTax(price: number, quantity: number, tax: number): number {
  const total = price * quantity
  return roundNum(total * (tax / 100))
}
export function calculateTotal(price: number, quantity: number, tax: number): number {
  const total = price * quantity
  return roundNum(total * (tax / 100) + total)
}

export function roundNum(number: number): number {
  return +(Math.round(Number(number + 'e+2')) + 'e-2')
}
