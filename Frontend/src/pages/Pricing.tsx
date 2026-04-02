import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Pricing() {
    const { user } = useAuth();
    const plans = [
        {
            id: "free",
            name: "Free Starter",
            price: "₹0",
            period: "/forever",
            description: "Explore the platform with limited credits.",
            features: [
                "1 Free Load Test Credit",
                "Basic Metrics Dashboard",
                "Community Support",
                "1 Day Retention"
            ],
            cta: "Start for Free",
            href: "/signup"
        },
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
                "7 Day Retention",
                "Custom Load Profiles"
            ],
            cta: "Get Pro Access",
            href: "/signup"
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
                "GitHub Integration",
                "API Access"
            ],
            popular: true,
            cta: "Choose Elite",
            href: "/signup"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation Shorthand */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <Link href="/">
                    <span className="text-2xl font-bold font-display cursor-pointer bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Prefracta AI
                    </span>
                </Link>
                {!user ? (
                    <div className="flex gap-6">
                        <Link href="/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                ) : (
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                )}
            </nav>

            <div className="py-20 text-center max-w-3xl mx-auto px-4">
                <h1 className="text-5xl font-bold font-display mb-6 tracking-tight">Flexible Pricing for Every Scale</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    From solo developers to enterprise teams, choose the plan that fits your performance testing needs.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-32">
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => {
                        const isCurrentPlan = user?.subscription.plan === plan.id;
                        return (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'border-primary shadow-2xl shadow-primary/20 scale-105 z-10' : 'border-border/50 shadow-lg'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full tracking-wider">
                                        RECOMMENDED
                                    </div>
                                )}

                                <CardHeader className="text-center pt-10">
                                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                    <CardDescription className="mt-2 text-base">{plan.description}</CardDescription>
                                    <div className="mt-6 flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-black font-display tracking-tighter">{plan.price}</span>
                                        <span className="text-muted-foreground font-medium">{plan.period}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 px-8 py-8">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-medium">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-muted-foreground leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="pb-10 pt-4">
                                    <Link href={user ? (isCurrentPlan ? "#" : "/subscription") : plan.href} className="w-full">
                                        <Button
                                            className={`w-full h-12 text-lg font-bold group ${plan.popular ? 'bg-primary hover:bg-primary/90 shadow-lg' : ''}`}
                                            variant={plan.popular ? "default" : "outline"}
                                            disabled={isCurrentPlan}
                                        >
                                            {isCurrentPlan ? "Current Plan" : plan.cta}
                                            {!isCurrentPlan && <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-24 text-center">
                    <p className="text-muted-foreground font-medium mb-4 italic">Powering performance for modern teams.</p>
                    <div className="flex justify-center flex-wrap gap-12 opacity-40 grayscale">
                        {/* Brand Mockups */}
                        <span className="font-bold text-2xl tracking-tighter">CLOUDCORE</span>
                        <span className="font-bold text-2xl tracking-tighter">DATAVIZ</span>
                        <span className="font-bold text-2xl tracking-tighter">NETSTREAM</span>
                        <span className="font-bold text-2xl tracking-tighter">SECURELY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
