import type { Products } from "../types/types";
import { downloadBlob } from '../download'

export const API_URL = 'http://localhost:3333'

export function urlExport(category: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  return `${API_URL}/products/export?${params}`
}

function extractFileName(contentDisposition: string | null) {
    const match = contentDisposition?.match(/filename="?([^";]+)"?/)
    return match?.[1] ?? null
}

export async function listProducts(category: string): Promise<Products[]> {
    const params = new URLSearchParams()

    if (category) params.set('category', category)

    const response = await fetch(`${API_URL}/products?${params}`)
    if (!response.ok) throw new Error(`Erro ${response.status}`)

    return response.json()
}

export async function exportProductsCsv(category: string) {
  const response = await fetch(urlExport(category))
  if (!response.ok) throw new Error(`Erro ${response.status}`)

  const blob = await response.blob()
  const name = extractFileName(response.headers.get('Content-Disposition'))

  downloadBlob(blob, name ?? 'products.csv')
}