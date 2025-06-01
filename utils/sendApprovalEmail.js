import transporter from '@/lib/mailer';

export default async function sendApprovedEmail({ orderDetails, orderId, orderNum }) {
  const mailOptions = {
    from: 'no-reply@shopzone.com',
    to: orderDetails.email,
    subject: `Order Confirmed: #${orderNum}`,
    html: `
      <h2>Thank you for your purchase, ${orderDetails.fullName}!</h2>
      <p>Order ID: ${orderId}</p>
      <p>Your order <strong>#${orderNum}</strong> has been confirmed.</p>
      <h3>Order Details:</h3>
      <ul>
        <li><strong>Product:</strong> ${orderDetails.product.title}</li>
        <li><strong>Variant:</strong> $${orderDetails.product.variant}</li>
        <li><strong>Quantity:</strong> ${orderDetails.product.qty}</li>
        <p className="mb-2">Total: ${orderDetails.product.price * orderDetails.product.qty}</p>
      </ul>
      <p>We will notify you once your order is shipped.</p>
      <p>For any questions, contact support@shopzone.com</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
