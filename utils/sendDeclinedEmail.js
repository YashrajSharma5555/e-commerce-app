import transporter from '@/lib/mailer';

export default async function sendDeclinedEmail({userEmail}) {
    console.log(userEmail)
  const mailOptions = {
    from: 'no-reply@shopzone.com',
    to: userEmail,
    subject: "Transaction Failed",
    html: `
      
      <p>Please try again or contact support if the issue persists.</p>

      <p><a href="mailto:support@shopzone.com">support@shopzone.com</a></p>

    `,
  };

  await transporter.sendMail(mailOptions);
}
