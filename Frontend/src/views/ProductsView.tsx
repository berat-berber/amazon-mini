import { useState } from 'react'
import { mockProducts } from '../mockData'

export default function ProductsView() {
  const [search, setSearch] = useState('')

  const term = search.trim().toLowerCase()
  const filtered = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(term),
  )

  return (
    <div className="view">
      <input
        className="search"
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid">
        {filtered.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p className="price">${p.price.toFixed(2)}</p>
            <p className={p.quantity > 0 ? 'stock' : 'stock out'}>
              {p.quantity > 0 ? `In stock: ${p.quantity}` : 'Out of stock'}
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="empty">No products match &quot;{search}&quot;</p>
      )}
    </div>
  )
}