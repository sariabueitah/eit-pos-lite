export function calTotalDiscount(quantity: number, discount: number): number {
  if (discount === 0) {
    return 0
  }
  const total = discount * quantity
  return roundNum(total)
}

export function calTotalTax(
  price: number,
  quantity: number,
  discount: number,
  tax: number
): number {
  const item = price - discount
  const itemTax = item * (tax / 100)
  const total = itemTax * quantity
  return roundNum(total)
}
export function calTotal(price: number, quantity: number, discount: number, tax: number): number {
  const item = price - discount
  const itemWithTax = item * (tax / 100) + item
  const total = itemWithTax * quantity
  return roundNum(total)
}

export function roundNum(number: number): number {
  return +(Math.round(Number(number + 'e+2')) + 'e-2')
}
