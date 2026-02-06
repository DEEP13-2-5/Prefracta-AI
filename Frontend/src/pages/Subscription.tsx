import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useCreateSubscription } from "@/hooks/use-payment";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function Subscription() {
  const { user } = useAuth();
  const createSub = useCreateSubscription();
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const plans = [
    {
      id: "weekly",
      name: "Weekly Pro",
      price: "₹499",
      period: "/week",
      description: "Perfect for short-term project sprints.",
      features: [
        "Unlimited Load Tests",
        "Basic AI Insights",
        "Email Support",
        "7 Day Retention"
      ]
    },
    {
      id: "monthly",
      name: "Monthly Elite",
      price: "₹1,499",
      period: "/month",
      description: "For teams scaling production services.",
      features: [
        "Unlimited Load Tests",
        "Advanced AI Architecture Review",
        "Priority Support",
        "30 Day Retention",
        "GitHub Integration"
      ],
      popular: true
    }
  ];

  // Helper to check if a plan is currently active
  const isPlanActive = (planId: string) => {
    if (!user) return false;
    if (user.subscription.plan !== planId) return false;

    // Free plan is always "active" if it's the current plan
    if (planId === 'free') return true;

    // For paid plans, check if not expired
    if (user.subscription.expiry) {
      const expiryDate = new Date(user.subscription.expiry);
      const now = new Date();
      return expiryDate > now;
    }

    return false;
  };

  return (
    <Layout>
      <div className="py-8 text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl font-bold font-display mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Get access to premium load testing infrastructure and AI analysis.
          Your current plan: <span className="font-semibold text-primary capitalize">{user?.subscription.plan}</span>
          {user?.subscription.daysLeft !== undefined && user.subscription.daysLeft > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              ({user.subscription.daysLeft} days left)
            </span>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isActive = isPlanActive(plan.id);
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold font-display">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full h-11 text-base"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={createSub.isPending || isActive}
                  onClick={() => {
                    setActivePlan(plan.id);
                    createSub.mutate(plan.id as 'weekly' | 'monthly', {
                      onSettled: () => setActivePlan(null)
                    });
                  }}
                >
                  {createSub.isPending && activePlan === plan.id ? <Loader2 className="animate-spin mr-2" /> : null}
                  {isActive ? "Current Plan" : `Choose ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        Secured by Razorpay. Cancel anytime from your dashboard.
      </div>
    </Layout>
  );
}
