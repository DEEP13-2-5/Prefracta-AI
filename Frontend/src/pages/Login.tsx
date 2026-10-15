import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Activity, ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { PublicNavigation } from '@/components/PublicShell';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await api.login(email, password);
            if (result.error) throw new Error(result.error);
            login(result.token, result.user);
            setLocation('/dashboard');
        } catch (error: any) {
            const message = (error?.message || '').toLowerCase().includes('timed out')
                ? 'Backend is waking up. Please wait 10-20 seconds and try again.'
                : error.message;
            toast({ title: 'Login Failed', description: message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="public-premium min-h-screen font-sans flex flex-col relative overflow-hidden">
            <PublicNavigation />

            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-20" />
            {/* Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.07)_0,transparent_65%)] blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0,transparent_65%)] blur-[80px] pointer-events-none -z-10" />

            {/* Header */}
            <header className="hidden border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-18 py-4 flex items-center justify-between">
                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-700/60 flex items-center justify-center bg-slate-900 group-hover:border-cyan-500/60 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                                <Activity className="w-5 h-5 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                                Prefracta<span className="text-cyan-400 font-extrabold">.ai</span>
                            </span>
                        </div>
                    </Link>

                    <Link href="/">
                        <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Home
                        </button>
                    </Link>
                </div>
            </header>

            {/* Main content — centered */}
            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40">

                        {/* Top accent */}
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

                        <div className="p-8">
                            <div className="mb-8">
                                <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
                                <p className="text-slate-400 text-sm mt-1.5">Sign in to your Prefracta AI account.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email field */}
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 focus:ring-0 focus:outline-none rounded-xl h-12 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 transition-colors"
                                    />
                                </div>

                                {/* Password field */}
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 focus:ring-0 focus:outline-none rounded-xl h-12 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 transition-colors"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all group text-sm"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Sign In
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-slate-800/60 text-center text-sm text-slate-500">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                                    Create one free
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Subtext */}
                    <p className="text-center text-xs text-slate-700 mt-5 font-mono">
                        Protected by Prefracta Auth · MIT Licensed
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
