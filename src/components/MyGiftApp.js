import React, { useState, useRef, useEffect, memo } from "react";
import { Search, Filter } from "lucide-react";
import wallet from "../../public/images/wallet.jpg";
import watch from "../../public/images/watch.jpg";
import candles from "../../public/images/candles.jpg";
import walletM from "../../public/images/walletM.jpg";
import earbuds from "../../public/images/earbuds.jpg";
import scarf from "../../public/images/scarf.jpg";
import Gift from "../../public/images/gift.png";

// Sample product data with gender, category, and links
const sampleProducts = [
  {
    id: 1,
    name: "Hill Berry Leather Wallet",
    price: 45.99,
    category: "wallet",
    gender: "female",
    image: wallet,
    link: "https://hillberry.com/wallet",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 129.99,
    category: "electronics",
    gender: "unisex",
    image: watch,
    link: "https://amazon.com/smart-watch",
  },
  {
    id: 3,
    name: "Union of London Votive Candle Set",
    price: 59.99,
    category: "candles",
    gender: "unisex",
    image: candles,
    link: "https://unionoflondon.com/candles",
  },
  {
    id: 4,
    name: "Luxury Silk Scarf",
    price: 89.99,
    category: "accessories",
    gender: "female",
    image: scarf,
    link: "https://fashion.com/silk-scarf",
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 179.99,
    category: "electronics",
    gender: "male",
    image: earbuds,
    link: "https://amazon.com/earbuds",
  },
  {
    id: 6,
    name: "Polo Ralph Lauren WALLET",
    price: 79.99,
    category: "wallet",
    gender: "male",
    image: walletM,
    link: "https://ralphlauren.com/wallet",
  },
];

const categories = ["wallet", "electronics", "candles", "accessories"];
const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under $50", value: "0-50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100 - $150", value: "100-150" },
  { label: "Over $150", value: "150+" },
];

const genderMap = {
  male: ["for male", "for men"],
  female: ["for female", "for women"],
};

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
  for (const [key, values] of Object.entries(genderMap)) {
    if (values.some((val) => lowerQuery.includes(val))) {
      gender = key;
      break;
    }
  }

  // Extract category - now checks for category mentions more flexibly
  let category = null;
  const categoryKeywords = {
    wallet: ["wallet", "wallets", "purse"],
    electronics: [
      "electronics",
      "gadget",
      "tech",
      "electronic",
      "device",
      "gadgets",
      "watch",
      "earbud",
    ],
    candles: ["candle", "candles", "scented"],
    accessories: ["accessory", "accessories", "scarf", "scarves"],
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      category = cat;
      break;
    }
  }

  return { category, gender, maxPrice };
};

// Filters products based on all criteria
const filterProducts = (products, query, category, priceRange) => {
  const {
    category: searchCategory,
    gender,
    maxPrice,
  } = parseSearchQuery(query);

  return products.filter((product) => {
    // Natural language search filters
    if (gender !== "unisex" && product.gender !== gender) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    if (searchCategory && product.category !== searchCategory) return false;

    // Dropdown category filter
    if (category !== "all" && product.category !== category) return false;

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        if (product.price < min || product.price > max) return false;
      } else {
        // For "150+" case
        if (product.price < 150) return false;
      }
    }

    return true;
  });
};

// Search Bar Component
const SearchBar = memo(({ searchQuery, setSearchQuery }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <div className="flex justify-between items-center mb-3">
        <p className="text-purple-600 font-bold">${product.price}</p>
        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          {product.category}
        </span>
      </div>
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        View in Store
      </a>
    </div>
  </div>
));

const MyGiftApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  const filteredProducts = filterProducts(
    sampleProducts,
    searchQuery,
    selectedCategory,
    selectedPriceRange
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={Gift} alt="MyGift Logo" className="w-8 h-8 mr-2" />
            <h1 className="text-2xl font-bold">MyGift</h1>
          </div>
          <p className="text-sm">Find the Perfect Gift</p>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border-t-4 border-purple-600 p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">
              Who are you buying for?
            </label>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200"
            >
              <Filter className="mr-2" size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button className="w-full py-3 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700">
              <Search className="mr-2" size={16} />
              Find Perfect Gifts
            </button>
          </div>
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
    </div>
  );
};

export default MyGiftApp;
