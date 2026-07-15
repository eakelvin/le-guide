"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useFormStatus } from "react-dom";
import { LoginPanel } from "@/components/layout/LeftPanel";
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
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { cn } from "@/lib/utils";
import { loginAction } from "@/features/auth/login";
import { googleLogin } from "@/features/auth/google-login";
import { useTranslations } from "next-intl";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            className={cn(
                "w-full font-medium transition-all",
                pending && "opacity-80"
            )}
            size="lg"
            disabled={pending}
        >
            {pending ? (
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
    );
}

export function LoginForm() {
    const t = useTranslations("auth");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const searchParams = useSearchParams();
    const next = searchParams.get("next") ?? "/dashboard";
    const checkEmail = searchParams.get("checkEmail") === "1";
    const signupEmail = searchParams.get("email");
    const confirmed = searchParams.get("confirmed") === "1";
    const fromSignup = searchParams.get("fromSignup") === "1";
    const signedOut = searchParams.get("signedOut") === "1";

    const router = useRouter();
    const authToastRef = useRef<string | null>(null);

    useEffect(() => {
        if (signedOut) {
            const k = "signedOut";
            if (authToastRef.current !== k) {
                authToastRef.current = k;
                toast.success(t("signedOut"));
                router.replace(AUTH_ROUTES.login, { scroll: false });
            }
            return;
        }

        if (fromSignup && checkEmail) {
            const k = "fromSignup";
            if (authToastRef.current !== k) {
                authToastRef.current = k;
                toast.success(t("checkEmailToast"));
                const emailParam = signupEmail
                    ? `&email=${encodeURIComponent(signupEmail)}`
                    : "";
                router.replace(
                    `${AUTH_ROUTES.login}?checkEmail=1${emailParam}`,
                    { scroll: false },
                );
            }
            return;
        }

        if (confirmed) {
            const k = "confirmed";
            if (authToastRef.current !== k) {
                authToastRef.current = k;
                toast.success(t("emailConfirmed"));
                router.replace(AUTH_ROUTES.login, { scroll: false });
            }
        }
    }, [
        signedOut,
        fromSignup,
        checkEmail,
        confirmed,
        signupEmail,
        router,
    ]);

    const [state, formAction] = useActionState(loginAction, {});

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <LoginPanel />

            {/* Right panel */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[400px] animate-fade-up">

                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="no-underline">
                            <span className="font-serif text-2xl font-light tracking-tight text-foreground">
                                Le<span className="text-forest-900">Guide</span>
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
                            {confirmed && (
                                <div className="text-sm text-forest-900 bg-forest-50 border border-forest-100 rounded-md px-3 py-2">
                                    Email confirmed. You can sign in now.
                                </div>
                            )}
                            {checkEmail && (
                                <div className="text-sm text-forest-900 bg-forest-50 border border-forest-100 rounded-md px-3 py-2">
                                    We sent a confirmation link{signupEmail ? ` to ${signupEmail}` : ""}. Please check your
                                    inbox to verify your email before signing in.
                                </div>
                            )}
                            {/* OAuth buttons */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full font-normal"
                                type="button"
                                onClick={() => googleLogin(next)}
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
                            {state?.error && (
                                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                                    <span className="shrink-0">⚠</span>
                                    {state.error}
                                </div>
                            )}

                            {/* Form */}
                            <form action={formAction} className="space-y-4">
                                <input type="hidden" name="next" value={next} />
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@university.edu"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href={AUTH_ROUTES.forgotPassword}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-9 pr-9"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
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

                                {/* <div className="flex items-center space-x-2">
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
                                </div> */}

                                <Button
                                    type="submit"
                                    className="hidden"
                                >
                                    Sign in
                                </Button>
                                <SubmitButton />
                            </form>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pt-0">
                            <Separator />
                            <p className="text-sm text-center text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href={AUTH_ROUTES.register}
                                    className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                                >
                                    Create one
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
