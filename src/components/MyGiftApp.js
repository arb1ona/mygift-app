import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Search } from "lucide-react";
import wallet from "../images/wallet.jpg";
import watch from "../images/watch.jpg";
import candles from "../images/candles.jpg";

// Sample product data with gender and category
const sampleProducts = [
  {
    id: 1,
    name: "Hill Berry Leather Wallet",
    price: 45.99,
    category: "wallet",
    gender: "unisex",
    image: wallet,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 129.99,
    category: "electronics",
    gender: "unisex",
    image: watch,
  },
  {
    id: 3,
    name: "Union of London Votive Candle Set",
    price: 59.99,
    category: "candles",
    gender: "unisex",
    image: candles,
  },
  {
    id: 4,
    name: "Luxury Silk Scarf",
    price: 89.99,
    category: "accessories",
    gender: "female",
    image: "/api/placeholder/200/200",
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 179.99,
    category: "electronics",
    gender: "male",
    image: "/api/placeholder/200/200",
  },
];

// Parses the search query and extracts category, gender, and price range
const parseSearchQuery = (query) => {
  const lowerQuery = query.toLowerCase();

  // Extract price range
  const priceMatch = lowerQuery.match(
    /under (\d+)|below (\d+)|less than (\d+)/
  );
  const maxPrice = priceMatch
    ? parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3])
    : null;

  // Extract gender
  let gender = "unisex";
  if (lowerQuery.includes("for male") || lowerQuery.includes("for men"))
    gender = "male";
  if (lowerQuery.includes("for female") || lowerQuery.includes("for women"))
    gender = "female";

  // Extract category (based on predefined product categories)
  const categories = ["wallet", "candles", "electronics", "accessories"];
  const foundCategory =
    categories.find((cat) => lowerQuery.includes(cat)) || null;

  return { category: foundCategory, gender, maxPrice };
};

// Filters products based on parsed query
const filterProducts = (products, query) => {
  const { category, gender, maxPrice } = parseSearchQuery(query);

  return products.filter((product) => {
    if (category && product.category !== category) return false;
    if (gender !== "unisex" && product.gender !== gender) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    return true;
  });
};

// Search Bar Component
const SearchBar = memo(({ searchQuery, setSearchQuery }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus(); // Preserve focus
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Try: 'wallet for female', 'candles under 70', 'electronics for men under 150'"
      value={searchQuery}
      onChange={handleSearchChange}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    />
  );
});

// Product Card Component
const ProductCard = memo(({ product }) => (
  <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-56 object-cover"
    />
    <div className="p-5">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 text-sm">Price: ${product.price}</p>
      <span className="text-sm text-gray-500">{product.category}</span>
    </div>
  </div>
));

const MyGiftApp = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = filterProducts(sampleProducts, searchQuery);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border-t-4 border-purple-600 p-6">
        <label className="block text-sm font-medium mb-2">
          Who are you buying for?
        </label>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button className="w-full py-3 mt-4 bg-purple-600 text-white rounded-lg flex items-center justify-center">
          <Search className="mr-2" size={16} />
          Find Perfect Gifts
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No matching products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyGiftApp;
