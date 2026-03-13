export const productViews = []
export const productMetrics = []

export const updateProductMetrics = (productId, data) => {
  const existing = productMetrics.find(p => p.product_id === productId)
  if (existing) {
    Object.assign(existing, data)
  } else {
    productMetrics.push({ product_id: productId, ...data })
  }
  return productMetrics
}

export const getProductMetrics = () => productMetrics

export const groupEventsByProductId = (events) => {
  const grouped = events.reduce((acc, event) => {
    const { product_id } = event
    if (!acc[product_id]) {
      acc[product_id] = {
        product_id,
        product_name: event.product_name,
        views: 0
      }
    }
    acc[product_id].views += 1
    return acc
  }, {})

  return Object.values(grouped)
}
