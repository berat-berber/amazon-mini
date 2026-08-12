import { useState } from 'react'
import './App.css'
import ProductsView from './views/ProductsView'
import CreateOrderView from './views/CreateOrderView'
import OrdersView from './views/OrdersView'

type Tab = 'products' | 'create' | 'orders'

const tabs: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'create', label: 'New Order' },
  { id: 'orders', label: 'Orders' },
]

function App() {
  const [tab, setTab] = useState<Tab>('products')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Amazon Mini</h1>
        <nav className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'tab active' : 'tab'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'products' && <ProductsView />}
        {tab === 'create' && <CreateOrderView />}
        {tab === 'orders' && <OrdersView />}
      </main>
    </div>
  )
}

export default App