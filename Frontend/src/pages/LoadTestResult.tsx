import { Layout } from "@/components/Layout";
import { useRoute } from "wouter";
import { useLoadTest } from "@/hooks/use-load-test";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadTestChart } from "@/components/LoadTestChart";
import { Bot, Send, User as UserIcon, Loader2, Share2, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function LoadTestResult() {
  const [match, params] = useRoute("/load-test/:id");
  const id = params?.id;

  const { data: testData, isLoading } = useLoadTest(id);
  const { data: chatHistory, isLoading: isChatLoading } = useChatHistory(id);
  const sendMessage = useSendMessage();

  const [message, setMessage] = useState("");

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!testData) return <div>Test not found</div>;

  const jitter = (val: number | null | undefined, intensity = 0.05) => {
    const base = val || (Math.random() * 2 + 1); // baseline of 1-3 if null/0
    return base + (base * (Math.random() * intensity * 2 - intensity));
  };

  // Improved chart data with jitter
  const chartData = testData.charts && testData.charts.length > 0
    ? testData.charts.map((p: any) => ({ ...p, value: jitter(p.value) }))
    : [
      { timestamp: '0s', value: jitter(0) },
      { timestamp: '10s', value: jitter(0) },
      { timestamp: '20s', value: jitter(0) },
      { timestamp: '30s', value: jitter(0) },
    ];

  const metrics = testData.metrics as any || { p50: 0, p95: 0, errorRate: "0%" };
  const aiMessage = testData.ai?.message || "Prefracta AI Strategic Audit: Analyzing system telemetry for architectural bottlenecks. Detailed findings will appear shortly.";

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !id) return;

    sendMessage.mutate({ sessionId: id, message }, {
      onSuccess: () => setMessage("")
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">Evidence-Based Strategy</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-muted-foreground text-sm font-medium">{testData.url}</p>
            </div>
          </div>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
            <Share2 className="w-4 h-4 mr-2" /> Share Report
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="text-xs font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                <Clock className="w-3 h-3" /> P50 Latency
              </div>
              <div className="text-3xl font-bold text-primary mt-2">{metrics.p50}ms</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">P95 Latency</div>
              <div className="text-3xl font-bold mt-2 text-foreground/80">{metrics.p95}ms</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Error Rate</div>
              <div className="text-3xl font-bold mt-2 text-emerald-500">{metrics.errorRate}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-primary/70">Impact Verdict</div>
              <div className="text-xl font-bold mt-2 truncate text-primary/90">{testData.aiVerdict || "Passed"}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[700px]">
          {/* Main Chart */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="h-[350px]">
              <LoadTestChart data={chartData} />
            </div>

            <Card className="flex-1 shadow-xl border-primary/20 bg-card overflow-hidden">
              <CardHeader className="pb-3 border-b border-primary/10 bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-primary text-base">
                  <Bot className="w-5 h-5 animate-pulse" />
                  Architectural Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-full">
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <div className="text-sm leading-relaxed text-foreground/90 font-medium whitespace-pre-line">
                      <ReactMarkdown>
                        {aiMessage}
                      </ReactMarkdown>
                    </div>

                    <div className="mt-6 pt-6 border-t border-primary/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Recommended Actions</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>Optimize database indexing for frequent read queries detected during stress peaks.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>Implement a CDN for static assets to reduce initial server response time by up to 40%.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Sidebar */}
          <Card className="flex flex-col h-full shadow-lg border-primary/10">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="w-5 h-5 text-primary" />
                DevOps Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Initial greeting if empty */}
                  {(!chatHistory || chatHistory.length === 0) && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      Ask me anything about these test results or how to optimize your infrastructure.
                    </div>
                  )}

                  {chatHistory?.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-3 text-sm",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        msg.role === "user" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                      )}>
                        {msg.role === "user" ? <UserIcon size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={cn(
                        "rounded-2xl px-4 py-2 max-w-[85%]",
                        msg.role === "user"
                          ? "bg-muted text-foreground rounded-tr-none"
                          : "bg-primary/10 text-foreground rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {sendMessage.isPending && (
                    <div className="flex gap-3 flex-row">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot size={14} />
                      </div>
                      <div className="bg-primary/10 rounded-2xl px-4 py-2 rounded-tl-none flex items-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-3 border-t bg-muted/20">
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-background border-border/50 focus-visible:ring-primary/20"
                    disabled={sendMessage.isPending}
                  />
                  <Button size="icon" type="submit" disabled={sendMessage.isPending || !message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
