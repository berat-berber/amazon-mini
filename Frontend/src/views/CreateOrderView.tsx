import { useState } from 'react'
import { mockProducts } from '../mockData'

interface PlacedOrder {
  customerName: string
  totalAmount: number
  lineCount: number
}

export default function CreateOrderView() {
  const [customerName, setCustomerName] = useState('')
  const [qty, setQty] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)

  const lines = mockProducts
    .filter((p) => (qty[p.id] ?? 0) > 0)
    .map((p) => ({ product: p, quantity: qty[p.id] }))

  const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0)

  const inc = (id: string, stock: number) => {
    setQty((q) => ({ ...q, [id]: Math.min(stock, (q[id] ?? 0) + 1) }))
    setError(null)
  }
  const dec = (id: string) => {
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) - 1) }))
    setError(null)
  }

  const placeOrder = () => {
    if (!customerName.trim()) {
      setError('Customer name is required')
      setPlaced(null)
      return
    }
    if (lines.length === 0) {
      setError('Select at least one item')
      setPlaced(null)
      return
    }
    setPlaced({
      customerName: customerName.trim(),
      totalAmount: total,
      lineCount: lines.length,
    })
    setError(null)
    setCustomerName('')
    setQty({})
  }

  return (
    <div className="view">
      <h2>New order</h2>

      <label className="field">
        <span>Customer name</span>
        <input
          type="text"
          placeholder="e.g. Alice Smith"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </label>

      <div className="grid">
        {mockProducts.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p className="price">${p.price.toFixed(2)}</p>
            <p className={p.quantity > 0 ? 'stock' : 'stock out'}>
              {p.quantity > 0 ? `In stock: ${p.quantity}` : 'Out of stock'}
            </p>
            <div className="stepper">
              <button onClick={() => dec(p.id)} disabled={(qty[p.id] ?? 0) === 0}>
                −
              </button>
              <span>{qty[p.id] ?? 0}</span>
              <button
                onClick={() => inc(p.id, p.quantity)}
                disabled={p.quantity === 0 || (qty[p.id] ?? 0) >= p.quantity}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {lines.length > 0 && (
        <div className="summary">
          <h3>Order summary</h3>
          {lines.map((l) => (
            <div key={l.product.id} className="summary-line">
              <span>
                {l.product.name} × {l.quantity}
              </span>
              <span>${(l.product.price * l.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button className="primary" onClick={placeOrder}>
        Place order
      </button>

      {error && <p className="error">{error}</p>}

      {placed && (
        <div className="success">
          <h3>Order placed</h3>
          <p>
            {placed.lineCount} item(s) for {placed.customerName} — total{' '}
            <strong>${placed.totalAmount.toFixed(2)}</strong>. (This is a mock —
            no API call yet.)
          </p>
        </div>
      )}
    </div>
  )
}