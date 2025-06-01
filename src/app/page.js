'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setProducts(data);

        const variantState = {};
        const qtyState = {};
        data.forEach((product) => {
          variantState[product._id] = product.variants?.[0]?.color || '';
          qtyState[product._id] = 1;
        });
        setSelectedVariants(variantState);
        setQuantities(qtyState);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleVariantChange = (productId, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleQtyChange = (productId, value) => {
    const qty = Math.max(1, Number(value));
    setQuantities((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

  const handleBuyNow = (productId) => {
    const variant = selectedVariants[productId];
    const qty = quantities[productId];
    const product = products.find(p => p._id === productId);
    const price = product?.price || 0;
    const title = encodeURIComponent(product?.title || '');

  
    router.push(`/checkout?productId=${productId}&variant=${variant}&qty=${qty}&price=${price}&title=${title}`);
  };
  

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100 text-black">
      <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-lg p-6 rounded-xl flex flex-col items-center">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-1 text-center">{product.title}</h2>
            <p className="text-gray-600 text-center text-sm mb-2">{product.description}</p>
            <p className="text-lg font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>

            <div className="mb-2 w-full">
              <label className="block text-sm font-medium mb-1">Variant</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedVariants[product._id]}
                onChange={(e) => handleVariantChange(product._id, e.target.value)}
              >
                {product.variants?.map((variant, idx) => (
                  <option key={idx} value={variant.color}>
                    {variant.color} {variant.size ? `- Size: ${variant.size}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantities[product._id]}
                onChange={(e) => handleQtyChange(product._id, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={() => handleBuyNow(product._id)}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
