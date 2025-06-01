import sendApprovedEmail from '@/utils/sendApprovalEmail';
import sendDeclinedEmail from '@/utils/sendDeclinedEmail';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderDetails, orderNum, orderId, status , userEmail} = body;

    if (!status) {
      return new Response(JSON.stringify({ message: 'Missing status' }), { status: 400 });
    }

    if (status === 'approved') {
      if (!orderNum || !orderDetails || !orderId) {
        return new Response(JSON.stringify({ message: 'Missing required data for approved status' }), { status: 400 });
      }
      await sendApprovedEmail({ orderNum, orderId, orderDetails });
      return new Response(JSON.stringify({ message: 'Approval email sent' }), { status: 200 });

    } else if (status === 'declined') {
        if ( !userEmail ) {
            return new Response(JSON.stringify({ message: 'Missing required data for approved status' }), { status: 400 });
          }
      await sendDeclinedEmail({userEmail});
      return new Response(JSON.stringify({ message: 'Declined email sent' }), { status: 200 });

    } else if (status === 'gateway_failure') {
        if ( !userEmail ) {
            return new Response(JSON.stringify({ message: 'Missing required data for approved status' }), { status: 400 });
          }
      await sendDeclinedEmail({userEmail}); 
      return new Response(JSON.stringify({ message: 'Gateway failure email sent' }), { status: 200 });

    } else {
      return new Response(JSON.stringify({ message: 'Invalid status' }), { status: 400 });
    }

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
