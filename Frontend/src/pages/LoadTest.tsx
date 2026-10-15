import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRunLoadTest } from "@/hooks/use-load-test";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Play, Loader2, Github, Globe, ShieldCheck, Zap, Radar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function LoadTest() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const runTest = useRunLoadTest();
  const [, setLocation] = useLocation();

  const [url, setUrl] = useState("");
  const [repo, setRepo] = useState("");
  const [scanAuthorization, setScanAuthorization] = useState(false);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);

  const canStartTest = (user?.credits || 0) > 0 || user?.subscription.plan !== 'free';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canStartTest) return;

    setIsSimulating(true);

    // Initial delay for immediate UI feedback
    setTimeout(() => {
      runTest.mutate(
        { url, githubRepo: repo || undefined, scanAuthorization },
        {
          onSuccess: (data: any) => {
            console.log("✅ Load test triggered successfully:", data.id);
            if (data.user) {
              updateUser(data.user);
            }
            setIsSimulating(false);
            // Redirect to dashboard instead of direct result page per latest requirement
            toast({
              title: "Load Test & Analysis Complete!",
              description: "Redirecting you to the dashboard to view insights...",
            });
            // Delay redirect to let toast be seen
            setTimeout(() => {
              setLocation("/dashboard");
            }, 2500);
          },
          onError: (error: any) => {
            console.error("❌ Test Mutation Error:", error);
            setIsSimulating(false);

            // Check for potential HTML response error
            let errorMessage = error.message;
            if (errorMessage?.includes("Unexpected token '<'")) {
              errorMessage = "Server error or timeout. Please check your URL and try again.";
            }

            toast({
              title: "Test Failed",
              description: errorMessage,
              variant: "destructive",
            });
          },
        }
      );
    }, 500);
  };

  if (!user) return null;

  // Check if subscription expired
  const isSubscriptionExpired = user.subscription.plan !== 'free' &&
    user.subscription.daysLeft !== undefined &&
    user.subscription.daysLeft === 0;

  if (isSubscriptionExpired) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12">
          <Card className="border-destructive border-2 bg-destructive/5 shadow-lg">
            <CardHeader>
              <CardTitle className="text-destructive">Subscription Expired</CardTitle>
              <CardDescription>
                Your subscription has ended. Please renew to continue running load tests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation('/subscription')}
                className="w-full h-12 text-base font-semibold"
              >
                Renew Subscription
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (user.credits === 0 && user.subscription.plan === 'free') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12">
          <Card className="border-destructive shadow-lg">
            <CardHeader>
              <CardTitle className="text-destructive">Free Trial Used</CardTitle>
              <CardDescription>
                You've used your 1 free load test. Subscribe to a plan to continue testing your infrastructure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation('/subscription')}
                className="w-full h-12 text-base font-semibold"
              >
                View Subscription Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary mb-3">New release assessment</p>
          <h1 className="text-3xl font-bold mb-2">Choose what to assess</h1>
          <p className="text-muted-foreground">We run observable checks against your staging environment and repository, then group the evidence in one report.</p>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Assessment scope</CardTitle>
            <CardDescription>Add a staging target and repository. The GitHub review is read-only.</CardDescription>
          </CardHeader>
          <CardContent>
            {isSimulating ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div
                    className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                  ></div>
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-lg">Collecting assessment evidence...</h3>
                  <p className="text-sm text-muted-foreground">Load, browser and repository checks are running in parallel.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url">Staging target URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="https://api.your-service.com"
                      className="pl-9"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      type="url"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repo">GitHub repository URL</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="repo"
                      placeholder="https://github.com/username/repo"
                      className="pl-9"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-6 mt-6">
                  <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
                    <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-600" /> Load test</span><span className="flex items-center gap-2"><Radar className="h-4 w-4 text-blue-600" /> Browser audit</span><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" /> Repo controls</span>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground"><p><span className="font-semibold">Usage:</span> {user?.subscription.plan === 'free' ? 'This assessment uses 1 credit.' : 'Unlimited assessments are included in your plan.'} Tests run only against the target you provide.</p>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
                    <input type="checkbox" checked={scanAuthorization} onChange={(e) => setScanAuthorization(e.target.checked)} className="mt-1 h-4 w-4 accent-blue-600" />
                    <span><strong className="text-slate-900">I own this target or have written authorization to test it.</strong><br />Prefracta will run passive security and browser checks against this staging/public URL.</span>
                  </label>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                    disabled={runTest.isPending || !canStartTest || !scanAuthorization}
                  >
                    {runTest.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Starting...
                      </>
                    ) : !canStartTest ? (
                      "Buy credits to run test"
                    ) : !scanAuthorization ? (
                      "Confirm authorization to continue"
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" /> Run assessment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
