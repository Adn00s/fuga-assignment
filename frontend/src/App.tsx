import './App.css'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Fuga Music Products</h1>
      </header>
      
      <main className="app-main">
        <div className="container">
          <ProductForm />
          <ProductList />
        </div>
      </main>
    </div>
  )
}

export default App
