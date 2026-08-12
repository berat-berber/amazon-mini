import { useEffect, useState } from 'react'
import { getProducts, type Product } from '../api'

export default function ProductsView() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    const timer = setTimeout(async () => {
      try {
        const data = await getProducts(search)
        if (active) setProducts(data)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        if (active) setLoading(false)
      }
    }, 300)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [search])

  return (
    <div className="view">
      <input
        className="search"
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="empty">Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {products.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p className="price">${p.price.toFixed(2)}</p>
              <p className={p.quantity > 0 ? 'stock' : 'stock out'}>
                {p.quantity > 0 ? `In stock: ${p.quantity}` : 'Out of stock'}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="empty">No products match &quot;{search}&quot;</p>
      )}
    </div>
  )
}