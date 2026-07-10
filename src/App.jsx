import React, { useState, useEffect } from "react";
import axios from "axios";

// Connect axios instance directly to our backend server
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://ecommerce-backend-itj1.onrender.com/api",
});

// Interceptor to automatically attach JWT tokens to secure requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function App() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  // Fetch product list only if token exists
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading product listings", err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Public signup is always a standard User account.
        // Admin accounts are provisioned manually and cannot be self-registered.
        await API.post("/auth/register", {
          name,
          email,
          password,
        });
        alert("Registration complete! Please login.");
        setIsRegistering(false);
        // Clear name field after registration
        setName("");
      } else {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setToken(res.data.token);
        setRole(res.data.role);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setProducts([]);
    setEmail("");
    setPassword("");
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", newProduct);
      alert("Product added successfully!");
      fetchProducts();
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
    } catch (err) {
      alert("Unauthorized or dynamic post error.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (
      window.confirm("Are you sure you want to completely delete this product?")
    ) {
      try {
        await API.delete(`/products/${productId}`);
        setProducts(products.filter((item) => item._id !== productId));
        alert("Product deleted successfully!");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };

  const handleBuyProduct = (productName) => {
    alert(
      `🎉 Order Placed Successfully for: ${productName}! (MERN Order API Simulated)`,
    );
  };

  // 🚪 RENDER LAYER 1: STRICT LOGIN / SIGN UP GATEWAY
  // Agar token nahi hai, toh page par kuch aur load nahi hoga.
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
            {isRegistering ? "Create Dashboard Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition shadow"
            >
              {isRegistering ? "Sign Up & Verify" : "Sign In Securely"}
            </button>
          </form>

          <div className="mt-6 text-center border-t pt-4">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline"
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Create Account"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🏢 RENDER LAYER 2: INTERACTIVE DASHBOARD LAYER (Visible only post-login)
  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      {/* Navbar Section */}
      <header className="flex flex-wrap justify-between items-center bg-blue-700 text-white p-4 rounded-xl shadow-md mb-8 gap-4">
        <h1 className="text-xl font-bold tracking-wide">
          E-Commerce Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="bg-blue-800 px-3 py-1 rounded text-sm font-semibold uppercase tracking-wider">
            Role: {role} panel
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Conditional Admin Controls Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
            🛠️ Operational Console
          </h2>
          {role === "admin" ? (
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Product Description
                </label>
                <textarea
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded text-sm bg-gray-50 focus:bg-white"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded text-sm shadow transition"
              >
                Publish Product to DB
              </button>
            </form>
          ) : (
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-800 font-medium">
                🛍️ Customer Account Active
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                You can browse live store options, view exact real-time stocks,
                and safely test secure checkout triggers.
              </p>
            </div>
          )}
        </div>

        {/* Right Columns: Showcase Live Catalog */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
            🛒 Live Product Catalog
          </h2>
          {products.length === 0 ? (
            <p className="text-sm text-gray-400 italic text-center py-12">
              No products found in the database. Use admin control panel to add
              items.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="p-4 border border-gray-100 bg-gray-50 rounded-lg flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 leading-tight">
                        {p.name}
                      </h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {p.description}
                    </p>
                  </div>

                  {/* Footer Area with Price, Stock, and Smart Conditional View Actions */}
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">
                        In Stock:{" "}
                        <strong className="text-gray-700">{p.stock}</strong>
                      </span>
                      <span className="text-base font-mono font-bold text-emerald-600">
                        ${p.price}
                      </span>
                    </div>

                    {/* CONDITION 1: Admin handles dynamic delete cleanup */}
                    {role === "admin" && (
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="w-full mt-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-3 rounded text-xs transition border border-red-200"
                      >
                        🗑️ Delete Product
                      </button>
                    )}

                    {/* CONDITION 2: Normal User gets transactional secure action tools */}
                    {role === "user" && (
                      <button
                        onClick={() => handleBuyProduct(p.name)}
                        className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded text-xs transition shadow-sm"
                      >
                        ⚡ Order Item Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
