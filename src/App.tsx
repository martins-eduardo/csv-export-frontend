import { useEffect, useState } from 'react'
import { exportProductsCsv, listProducts } from './utils/api'
import { formatData, formatPrice } from './utils/format'
import type { Products } from './types/types'
import './App.css'

const CATEGORYS = ['Eletronics', 'Office', 'House', 'Books']

function App() {
  const [products, setProducts] = useState<Products[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  async function exportFromBack() {
    setExporting(true)
    try {
      await exportProductsCsv(category)
    } catch (e) {
      alert(`Export fail: ${(e as Error).message}`)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    let ignore = false

    listProducts(category)
      .then((data) => {
        if (!ignore) setProducts(data)
      })
      .catch((e: Error) => {
        if (!ignore) setError(e.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [category])

  function changeCategory(newCategory: string) {
    setCategory(newCategory)
    setLoading(true)
    setError(null)
  }

  return (
    <main>
      <h1>Products</h1>

      <label>
        Category:{' '}
        <select value={category} onChange={(e) => changeCategory(e.target.value)}>
          <option value="">All</option>
          {CATEGORYS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error">Loading error: {error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Active</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7}>Loading...</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td className="numbers">{formatPrice(p.priceCents)}</td>
                <td className="numbers">{p.stock}</td>
                <td>{p.stock ? 'Yes' : 'No'}</td>
                <td>{formatData(p.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="actions">
        <span>{products.length} products</span>
        <button onClick={exportFromBack} disabled={exporting || loading}>Export CSV</button>
      </div>
    </main>
  )
}

export default App