import { api } from '@/lib/api';

// Razorpay TypeScript Interface
declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
    };
    theme?: {
        color?: string;
    };
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

/**
 * Initialize Razorpay payment
 * @param token - User auth token
 * @param planType - 'weekly' or 'monthly'
 * @param onSuccess - Callback after successful payment
 * @param onError - Callback on error
 */
export async function initiateRazorpayPayment(
    token: string,
    planType: 'weekly' | 'monthly',
    onSuccess: (user: any) => void,
    onError: (error: string) => void
) {
    try {
        // Step 1: Create order on backend
        const orderData = await api.createSubscription(token, planType);

        if (orderData.error) {
            throw new Error(orderData.error);
        }

        // Step 2: Configure Razorpay options
        const options: RazorpayOptions = {
            key: orderData.razorpayKeyId,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.orderId,
            handler: async function (response: RazorpayResponse) {
                try {
                    // Step 3: Verify payment on backend
                    const verification = await api.verifyPayment(token, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verification.error) {
                        throw new Error(verification.error);
                    }

                    // Step 4: Success callback with updated user
                    onSuccess(verification.user);
                } catch (err: any) {
                    onError(err.message || 'Payment verification failed');
                }
            },
            theme: {
                color: '#3B82F6', // Primary blue color
            },
        };

        // Step 5: Open Razorpay modal
        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (err: any) {
        onError(err.message || 'Failed to initiate payment');
    }
}
