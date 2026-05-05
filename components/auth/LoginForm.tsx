"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Mail, Lock, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ─── Left panel — decorative side ─────────────────────────────────── */
function PanelLeft() {
    const steps = [
        { label: "Visa Validation (OFII)", pct: 25, color: "#F0997B" },
        { label: "Housing & CAF", pct: 40, color: "#97C459" },
        { label: "Healthcare (CPAM)", pct: 0, color: "#85B7EB" },
        { label: "Banking", pct: 0, color: "#AFA9EC" },
        { label: "Transportation", pct: 0, color: "#EF9F27" },
    ];

    return (
        <div className="hidden lg:flex flex-col justify-between bg-forest-900 text-white p-12 relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 bg-white blur-[120px] -top-40 -left-40" />
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 bg-white blur-[80px] bottom-0 right-0" />
                {/* Dot grid */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            {/* Logo */}
            <div className="relative z-10">
                <Link href="/" className="text-white no-underline">
                    <div className="font-serif text-2xl font-light tracking-tight">
                        Arrive<span className="text-[#9ECC60]">France</span>
                    </div>
                    <div className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                        Student Admin Guide
                    </div>
                </Link>
            </div>

            {/* Progress preview card */}
            <div className="relative z-10 space-y-4">
                <div className="text-white/50 text-xs tracking-widest uppercase mb-6">
                    Your progress overview
                </div>

                <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
                    {steps.map((step) => (
                        <div key={step.label}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[13px] text-white/80">{step.label}</span>
                                <span className="text-[12px] font-medium" style={{ color: step.pct > 0 ? step.color : "rgba(255,255,255,0.3)" }}>
                                    {step.pct}%
                                </span>
                            </div>
                            <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${step.pct}%`, background: step.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Urgent callout */}
                <div className="flex items-start gap-3 bg-coral-600/20 border border-coral-400/30 rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-coral-400/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-coral-200 text-xs font-bold">!</span>
                    </div>
                    <div>
                        <p className="text-coral-200 text-sm font-medium">OFII deadline approaching</p>
                        <p className="text-coral-300/70 text-xs mt-0.5 leading-relaxed">
                            Validate your visa within 3 months of arrival to avoid legal issues.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quote */}
            <div className="relative z-10">
                <blockquote className="text-white/60 text-sm leading-relaxed italic font-serif font-light">
                    &ldquo;ArriveFrance saved me hours of confusion. I knew exactly what to do, in what order, from day one.&rdquo;
                </blockquote>
                <div className="flex items-center gap-2.5 mt-4">
                    <div className="w-7 h-7 rounded-full bg-forest-50 flex items-center justify-center text-[10px] font-medium text-forest-600">
                        YK
                    </div>
                    <div>
                        <p className="text-white/70 text-xs font-medium">Yuki Kobayashi</p>
                        <p className="text-white/40 text-xs">Sorbonne, Paris</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Login form ─────────────────────────────────────────────────── */
export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        // Simulate auth — replace with real auth call (NextAuth, Supabase, etc.)
        await new Promise((r) => setTimeout(r, 1200));
        setIsLoading(false);

        // Demo: redirect to dashboard
        window.location.href = "/dashboard";
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <PanelLeft />

            {/* Right panel */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[400px] animate-fade-up">

                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="no-underline">
                            <span className="font-serif text-2xl font-light tracking-tight text-foreground">
                                Arrive<span className="text-forest-900">France</span>
                            </span>
                        </Link>
                    </div>

                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl font-normal tracking-tight">Welcome back</CardTitle>
                            <CardDescription>
                                Sign in to continue your administrative journey
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* OAuth buttons */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full font-normal"
                                type="button"
                                disabled={isLoading}
                            >
                                <KeyRound className="size-4" aria-hidden />
                                Continue with Google
                            </Button>

                            <div className="relative">
                                <Separator />
                                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                                    or continue with email
                                </span>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                                    <span className="shrink-0">⚠</span>
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@university.edu"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-9 pr-9"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            tabIndex={-1}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(v) => setRememberMe(v === true)}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                                    >
                                        Remember me for 30 days
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full font-medium transition-all",
                                        isLoading && "opacity-80"
                                    )}
                                    size="lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Signing in…
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Sign in
                                            <ArrowRight className="size-4" aria-hidden />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pt-0">
                            <Separator />
                            <p className="text-sm text-center text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/register"
                                    className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                                >
                                    Create one free
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Footer note */}
                    <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
