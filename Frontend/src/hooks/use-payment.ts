import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useCreateSubscription() {
  const { token, updateUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const verifyMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!token) throw new Error("Not authenticated");
      const result = await api.verifyPayment(token, data);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: "Subscription activated!" });
      // Update local user state with new subscription/credits
      if (data.user) {
        updateUser(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return useMutation({
    mutationFn: async (planType: 'weekly' | 'monthly') => {
      if (!token) throw new Error("Not authenticated");
      const result = await api.createSubscription(token, planType);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: (data, planType) => {
      console.log("💰 Subscription Initialization Data:", data);
      if (!window.Razorpay) {
        toast({ title: "System Error", description: "Razorpay SDK not loaded", variant: "destructive" });
        return;
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: "DevOps Readiness Tool",
        description: `${planType} Subscription`,
        order_id: data.orderId,
        handler: function (response: any) {
          verifyMutation.mutate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planType: planType
          });
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
