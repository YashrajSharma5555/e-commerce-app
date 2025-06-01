import { useEffect } from 'react';

export default function DeclinedComponent({  userEmail }) {
  useEffect(() => {
    console.log(userEmail)
    async function fetchAndSendDeclined() {
      try {

        //  Send declined email
        const sendRes = await fetch('/api/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail,
            status: 'declined',
          }),
        });

        const sendMailResult = await sendRes.json();
        console.log('Send declined mail result:', sendMailResult.message);
      } catch (error) {
        console.error('Error in declined flow:', error);
      }
    }

    if (userEmail) {
      fetchAndSendDeclined();
    }
  }, [userEmail]);

  return (
    <h2 className="text-red-600">
      Order declined. Please refresh and try again!
    </h2>
  );
}
