"use client";

import { useEffect, useState } from 'react';

export default function ThankYouPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    if (!orderId) return;

    fetch(`/api/order?id=${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched order data:", data);
        setOrder(data);
      })
      .catch((err) => {
        console.error("Failed to fetch order:", err);
      });
  }, []);

  if (!order) return <p className="text-center p-6">Loading...</p>;

  return (
    <main className="min-h-screen flex justify-center items-center text-black bg-gray-100 p-6">
      <div className="bg-white shadow-lg p-8 rounded-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">🎉 Thank You for Your Purchase!</h1>
        <p className="mb-2 text-gray-700">Order Number: <span className="font-mono">{order.orderNumber}</span></p>
        <p className="mb-2">Order ID: <span className="font-mono">{order.orderId}</span></p>
        <p className="mb-2">Status: <span className="font-semibold text-green-600">{order.status}</span></p>
        <hr className="my-4" />
        <p className="mb-2 font-medium">Customer: {order.fullName}</p>
        <p className="mb-2">Email: {order.email}</p>
        <p className="mb-2">
          Product: {order.product.title} ({order.product.variant}) × {order.product.qty}
        </p>
        <p className="mb-2">Total: ${order.product.price * order.product.qty}</p>
        <hr className="my-4" />
        <p className="text-sm text-gray-500">A confirmation email has been sent to {order.email}.</p>
      </div>
    </main>
  );
}
