export interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  priceDuringOrder: number
}

export interface Order {
  id: string
  customerName: string
  createdAt: string
  totalAmount: number
  items: OrderItem[]
}

export const mockProducts: Product[] = [
  { id: 'p-monitor', name: "27\" 4K Monitor", price: 329.99, quantity: 15 },
  { id: 'p-keyboard', name: 'Mechanical Keyboard', price: 119.99, quantity: 25 },
  { id: 'p-mouse', name: 'Wireless Mouse', price: 49.99, quantity: 40 },
  { id: 'p-headset', name: 'Noise-Cancelling Headset', price: 199.99, quantity: 18 },
  { id: 'p-webcam', name: '1080p Webcam', price: 69.99, quantity: 30 },
  { id: 'p-docking-station', name: 'USB-C Docking Station', price: 149.99, quantity: 12 },
  { id: 'p-ssd', name: '1TB External SSD', price: 109.99, quantity: 22 },
  { id: 'p-usb-hub', name: '7-in-1 USB-C Hub', price: 39.99, quantity: 50 },
  { id: 'p-speakers', name: '2.1 Desktop Speakers', price: 89.99, quantity: 20 },
  { id: 'p-monitor-stand', name: 'Ergonomic Monitor Stand', price: 59.99, quantity: 35 },
]

export const mockOrders: Order[] = [
  {
    id: 'ord-1001',
    customerName: 'Example Customer',
    createdAt: '2026-08-11T14:32:00Z',
    totalAmount: 289.97,
    items: [
      { productId: 'p-keyboard', productName: 'Mechanical Keyboard', quantity: 2, priceDuringOrder: 119.99 },
      { productId: 'p-mouse', productName: 'Wireless Mouse', quantity: 1, priceDuringOrder: 49.99 },
    ],
  },
  {
    id: 'ord-1002',
    customerName: 'Alice Smith',
    createdAt: '2026-08-12T09:15:00Z',
    totalAmount: 459.98,
    items: [
      { productId: 'p-monitor', productName: "27\" 4K Monitor", quantity: 1, priceDuringOrder: 329.99 },
      { productId: 'p-ssd', productName: '1TB External SSD', quantity: 1, priceDuringOrder: 109.99 },
      { productId: 'p-webcam', productName: '1080p Webcam', quantity: 1, priceDuringOrder: 69.99 },
    ],
  },
  {
    id: 'ord-1003',
    customerName: 'Bob Johnson',
    createdAt: '2026-08-12T11:45:00Z',
    totalAmount: 149.97,
    items: [
      { productId: 'p-headset', productName: 'Noise-Cancelling Headset', quantity: 1, priceDuringOrder: 199.99 },
      { productId: 'p-usb-hub', productName: '7-in-1 USB-C Hub', quantity: 2, priceDuringOrder: 39.99 },
    ],
  },
]