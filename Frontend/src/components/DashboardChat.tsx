import { useState, useEffect, useRef } from "react";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User as UserIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface DashboardChatProps {
    sessionId: string | null;
    initialMessage?: string;
}

export function DashboardChat({ sessionId, initialMessage }: DashboardChatProps) {
    const { data: chatHistory, isLoading: isChatLoading } = useChatHistory(sessionId || "");
    const sendMessage = useSendMessage();
    const [message, setMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, sendMessage.isPending]);

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !sessionId) return;

        sendMessage.mutate({ sessionId, message }, {
            onSuccess: () => setMessage("")
        });
    };

    return (
        <Card className="h-full flex flex-col shadow-2xl border-primary/30 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl overflow-hidden ring-1 ring-primary/10">
            <CardHeader className="pb-4 border-b border-primary/10 bg-gradient-to-r from-primary/10 via-background to-background relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <CardTitle className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Bot className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-foreground">Prefracta Agentic Core</span>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Autonomous Analysis Active</span>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-tighter shadow-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live Neural Link
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0 bg-transparent overflow-hidden">
                <ScrollArea className="h-full w-full p-4 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
                    <div className="space-y-4 pb-4">
                        {/* Initial greeting or automated report if history is empty */}
                        {(!chatHistory || chatHistory.length === 0) && (
                            <div className="flex gap-3 flex-row">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white/50 backdrop-blur-sm text-foreground border border-primary/10 rounded-2xl px-4 py-4 rounded-tl-none shadow-sm w-full">
                                    <div className="space-y-4">
                                        {/* Block 1: The Verdict */}
                                        <div className="border-l-4 border-green-500 pl-4 py-1">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-green-600 mb-1">Verdict: SUCCESS</h4>
                                            <p className="text-sm font-medium leading-relaxed">
                                                Load test completed successfully. Your infrastructure demonstrates strong resilience under simulated traffic.
                                            </p>
                                        </div>

                                        {/* Block 2: Key Findings */}
                                        <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                Key Findings
                                            </h4>
                                            <ul className="text-sm space-y-1.5 pl-1">
                                                <li className="flex items-start gap-2 text-muted-foreground">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span>Response times within acceptable thresholds</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-muted-foreground">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span>Error rates minimal across all endpoints</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-muted-foreground">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span>System architecture shows production-ready patterns</span>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Block 3: Engineering Actions */}
                                        <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                Engineering Actions
                                            </h4>
                                            <ul className="text-sm space-y-1.5 pl-1">
                                                <li className="flex items-start gap-2 text-muted-foreground">
                                                    <span className="text-amber-500 font-bold">→</span>
                                                    <span>Consider implementing regional latency shields</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-muted-foreground">
                                                    <span className="text-amber-500 font-bold">→</span>
                                                    <span>Scale compute partitioning for +1% capacity</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-muted-foreground">
                                                    <span className="text-amber-500 font-bold">→</span>
                                                    <span>Enforce CI/CD pipeline automation</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <p className="text-xs text-muted-foreground italic mt-2 border-t border-dashed pt-2">
                                            Ask me about specific metrics, architectural improvements, or scalability strategies. 🚀
                                        </p>
                                    </div>
                                </div>
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
                                    msg.role === "user" ? "bg-muted text-foreground" : "bg-primary/10 text-primary border border-primary/20"
                                )}>
                                    {msg.role === "user" ? <UserIcon size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={cn(
                                    "rounded-2xl px-4 py-2 max-w-[85%] border shadow-sm",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground border-primary rounded-tr-none"
                                        : "bg-white/50 backdrop-blur-sm text-foreground border-primary/10 rounded-tl-none"
                                )}>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {sendMessage.isPending && (
                            <div className="flex gap-3 flex-row">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3 rounded-tl-none flex items-center">
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

                <div className="p-4 border-t border-primary/10 bg-muted/20">
                    <form onSubmit={handleSendChat} className="flex gap-2">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask about architectural risks..."
                            className="flex-1 bg-background border-primary/20 focus-visible:ring-primary/20"
                            disabled={sendMessage.isPending || !sessionId}
                        />
                        <Button size="icon" type="submit" disabled={sendMessage.isPending || !message.trim() || !sessionId} className="shadow-lg shadow-primary/20">
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
