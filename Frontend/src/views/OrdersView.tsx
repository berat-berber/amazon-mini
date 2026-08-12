import { useEffect, useState } from 'react'
import { getOrders, type Order } from '../api'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getOrders()
      .then((data) => {
        if (active) setOrders(data)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load orders')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const toggle = (id: string) =>
    setSelectedId((current) => (current === id ? null : id))

  return (
    <div className="view">
      <h2>Orders</h2>

      {loading && <p className="empty">Loading orders...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="empty">No orders yet.</p>
      )}

      {!loading &&
        !error &&
        orders.map((o) => (
          <div key={o.id} className="order">
            <button
              className="order-head"
              onClick={() => toggle(o.id)}
              aria-expanded={selectedId === o.id}
            >
              <span className="order-id">{o.id}</span>
              <span>{o.customerName}</span>
              <span className="order-date">{formatDate(o.createdAt)}</span>
              <span className="order-total">${o.totalAmount.toFixed(2)}</span>
            </button>

            {selectedId === o.id && <OrderDetail order={o} />}
          </div>
        ))}
    </div>
  )
}

function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="order-detail">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.productId}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>${item.priceDuringOrder.toFixed(2)}</td>
              <td>${(item.priceDuringOrder * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="order-total">Total: ${order.totalAmount.toFixed(2)}</p>
    </div>
  )
}