import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Code, Terminal, Zap, Shield, Cpu } from "lucide-react";

export default function Documentation() {
    const sections = [
        {
            title: "Getting Started",
            icon: Zap,
            content: "To begin, enter the URL of the application you want to test. Our Agentic AI will automatically analyze the endpoint and spin up necessary infrastructure for the simulation."
        },
        {
            title: "Load Test Configuration",
            icon: Terminal,
            content: "You can specify concurrent users, duration, and ramp-up periods. For advanced analysis, provide a GitHub repository URL to allow the AI to correlate code changes with performance metrics."
        },
        {
            title: "Understanding Metrics",
            icon: Cpu,
            content: "We track response times (p95, p99), throughput, and error rates. The results are visualized in real-time, allowing you to see exactly when and where your system starts to degrade."
        },
        {
            title: "AI Analysis Role",
            icon: Code,
            content: "Our Agentic AI does more than just show graphs. It identifies anomalous patterns, predicts scalability limits, and provides concrete architectural recommendations to improve stability."
        },
        {
            title: "Security & Stability",
            icon: Shield,
            content: "The stability radar assesses your application across multiple non-functional dimensions, including rate-limiting effectiveness, authentication resilience, and data integrity under load."
        },
        {
            title: "API Reference",
            icon: Book,
            content: "Integrate Prefracta AI into your CI/CD pipeline. Use our CLI or Webhooks to trigger load tests automatically on every pull request to catch performance regressions early."
        }
    ];

    return (
        <Layout>
            <div className="max-w-5xl mx-auto py-10 px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold font-display mb-4">Documentation</h1>
                    <p className="text-xl text-muted-foreground">Everything you need to master Prefracta AI and scale your apps.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <Card key={idx} className="border-border/50 hover:border-primary/20 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <section.icon size={24} />
                                </div>
                                <CardTitle className="text-xl">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {section.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-2xl bg-muted/50 border border-dashed border-border text-center">
                    <h2 className="text-2xl font-bold mb-4">Need more help?</h2>
                    <p className="text-muted-foreground mb-6">Our support team and community are here to help you scaling your journey.</p>
                    <div className="flex justify-center gap-4">
                        <button className="px-6 py-2 rounded-full bg-primary text-white font-medium">Contact Support</button>
                        <button className="px-6 py-2 rounded-full border border-border font-medium bg-background">Join Discord</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
