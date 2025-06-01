import { useEffect } from 'react';

export default function ApprovedComponent({ orderNum, orderId }) {
  useEffect(() => {
    async function fetchAndSend() {
      try {
        // Step 1: Fetch order details
        const orderRes = await fetch(`/api/order?id=${orderId}`);
        if (!orderRes.ok) throw new Error("Failed to fetch order details");

        const orderDetails = await orderRes.json();
        console.log("Fetched order details:", orderDetails);

        // Step 2: Send approval email
        const sendRes = await fetch('/api/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNum,
            orderId,
            orderDetails, 
            status: 'approved',
          }),
        });

        const sendMailResult = await sendRes.json();
        console.log("Send mail result:", sendMailResult.message);
      } catch (error) {
        console.error('Error in approval flow:', error);
      }
    }

    if (orderId) {
      fetchAndSend();
    }
  }, [orderNum, orderId]);

  return (
    <h2 className="text-green-600">
      Order approved successfully! Redirecting to thank you page!
    </h2>
  );
}
