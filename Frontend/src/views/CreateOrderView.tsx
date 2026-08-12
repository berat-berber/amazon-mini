import { useEffect, useState } from 'react'
import { createOrder, getProducts, type Order, type Product } from '../api'

export default function CreateOrderView() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [customerName, setCustomerName] = useState('')
  const [qty, setQty] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

  const loadProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
      setLoadError(null)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const lines = products
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

  const placeOrder = async () => {
    if (!customerName.trim()) {
      setError('Customer name is required')
      return
    }
    if (lines.length === 0) {
      setError('Select at least one item')
      return
    }

    setPlacing(true)
    setError(null)
    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
      })
      setPlacedOrder(order)
      setCustomerName('')
      setQty({})
      loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setPlacing(false)
    }
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

      {loading && <p className="empty">Loading products...</p>}
      {loadError && <p className="error">{loadError}</p>}

      {!loading && !loadError && (
        <div className="grid">
          {products.map((p) => (
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
      )}

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

      <button className="primary" onClick={placeOrder} disabled={placing}>
        {placing ? 'Placing order...' : 'Place order'}
      </button>

      {error && <p className="error">{error}</p>}

      {placedOrder && (
        <div className="success">
          <h3>Order placed</h3>
          <p>
            Order <strong>{placedOrder.id}</strong> for {placedOrder.customerName} —
            <strong> ${placedOrder.totalAmount.toFixed(2)}</strong>
          </p>
          {placedOrder.items.map((item) => (
            <p key={item.productId}>
              {item.productName} × {item.quantity} — $
              {(item.priceDuringOrder * item.quantity).toFixed(2)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}