import { useEffect, useState } from "react";
import "./App.css";
import ProductList from "./ProductList";
import CategorryFilter from "./CategoryFilter";

function App() {
  const [products, setproducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSerachTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((responce) => responce.json())
      .then((data) => setproducts(data));
    fetch("http://localhost:8080/api/categories")
      .then((responce) => responce.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSearchChange = (event) => {
    setSerachTerm(event.target.value);
  };
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId ? Number(categoryId) : null);
  };
  const filteredProducts = products
    .filter((product) => {
      return (
        (selectedCategory ? product.category.id == selectedCategory : true) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortOrder == "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  return (
    <div className="container">
      <h1 className="my-4">Product Catalog</h1>
      <div className="row align-items-center mb-4">
        <div className="col-md-3 col-sm-12 mb-2">
          <CategorryFilter
            categories={categories}
            onSelect={handleCategorySelect}
          />
        </div>
        <div className="col-md-5 col-sm-12 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="search for products"
            onChange={handleSearchChange}
          ></input>
        </div>
        <div className="col-md-4 col-sm-12 mb-2">
          <select className="form-control" onChange={handleSortChange}>
            <option value="asc">Sort by Price: Low to High</option>
            <option value="desc">Sort by Price: High to Low</option>
          </select>
        </div>
      </div>
      <div>
        {filteredProducts.length ? (
          //display product
          <ProductList products={filteredProducts} />
        ) : (
          <p>No Products Founds</p>
        )}
      </div>
    </div>
  );
}

export default App;
