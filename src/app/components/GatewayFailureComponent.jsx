import { useEffect } from 'react';

export default function GatewayFailureComponent({  userEmail }) {
  useEffect(() => {
    async function fetchAndSendGatewayFailure() {
      try {

        //  Send gateway failure email
        const sendRes = await fetch('/api/send-mail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail,
            status: 'gateway_failure',
          }),
        });

        const sendMailResult = await sendRes.json();
        console.log('Send gateway failure mail result:', sendMailResult.message);
      } catch (error) {
        console.error('Failed to report gateway failure:', error);
      }
    }

    if (userEmail) {
      fetchAndSendGatewayFailure();
    }
  }, [ userEmail]);

  return (
    <h2 className="text-yellow-600">
      Payment gateway failure. Please refresh and try again.
    </h2>
  );
}
