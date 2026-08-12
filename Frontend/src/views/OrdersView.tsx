import { useState } from 'react'
import { mockOrders, type Order } from '../mockData'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export default function OrdersView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const toggle = (id: string) =>
    setSelectedId((current) => (current === id ? null : id))

  return (
    <div className="view">
      <h2>Orders</h2>

      {mockOrders.length === 0 && <p className="empty">No orders yet.</p>}

      {mockOrders.map((o) => (
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