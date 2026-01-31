import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Zap,
  CreditCard,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Book,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Load Test", href: "/load-test", icon: Zap },
    { name: "Subscription", href: "/subscription", icon: CreditCard },
    ...(user?.subscription.plan === 'free' ? [{ name: "Pricing", href: "/pricing", icon: Tag }] : []),
    { name: "Documentation", href: "/docs", icon: Book },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <span className="text-xl font-bold font-display text-primary">Prefracta AI</span>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="Prefracta AI" className="w-12 h-12 rounded-lg" />
            <span className="text-xl font-bold font-display">Prefracta AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          {user ? (
            <>
              <div className="bg-muted/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <UserIcon size={16} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.subscription.plan} Plan
                      {user.subscription.plan !== 'free' && user.subscription.daysLeft !== undefined && (
                        <span className="ml-1 text-primary font-bold">({user.subscription.daysLeft}d left)</span>
                      )}
                    </p>
                  </div>
                </div>
                {user.subscription.plan === 'free' && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                    <span>Credits</span>
                    <span className="font-bold text-foreground">
                      {user.credits}
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={() => logout()}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Link href="/login">
                <Button className="w-full" variant="default">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full" variant="outline">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
