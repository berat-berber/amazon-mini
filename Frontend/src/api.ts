const base = import.meta.env.VITE_API_URL ?? 'https://localhost:5033/api'

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

export interface CreateOrderRequest {
  customerName: string
  items: { productId: string; quantity: number }[]
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, init)

  if (!response.ok) {
    const detail = await readDetail(response)
    throw new ApiError(response.status, detail)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

async function readDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      title?: string
      detail?: string
      status?: number
    }
    return body.detail ?? body.title ?? `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}

export function getProducts(search?: string): Promise<Product[]> {
  const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
  return request<Product[]>(`/products${query}`)
}

export function getOrders(): Promise<Order[]> {
  return request<Order[]>('/orders')
}

export function getOrder(id: string): Promise<Order> {
  return request<Order>(`/orders/${encodeURIComponent(id)}`)
}

export function createOrder(body: CreateOrderRequest): Promise<Order> {
  return request<Order>('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}