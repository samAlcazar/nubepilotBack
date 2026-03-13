export const productViews = []

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
