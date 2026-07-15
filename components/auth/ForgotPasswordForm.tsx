"use client";

import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useFormStatus } from "react-dom";
import { LoginPanel } from "@/components/layout/LeftPanel";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { forgotPasswordAction } from "@/features/auth/forgot-password";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className={cn("w-full font-medium transition-all", pending && "opacity-80")} size="lg" disabled={pending}>
            {pending ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending…
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    Send reset link
                    <ArrowRight className="size-4" aria-hidden />
                </span>
            )}
        </Button>
    );
}

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [state, formAction] = useActionState(forgotPasswordAction, {});

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <LoginPanel />
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[400px] animate-fade-up">
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="no-underline">
                            <span className="font-serif text-2xl font-light tracking-tight text-foreground">
                                Le<span className="text-forest-900">Guide</span>
                            </span>
                        </Link>
                    </div>

                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl font-normal tracking-tight">Forgot password</CardTitle>
                            <CardDescription>
                                Enter your email and we&apos;ll send you a link to choose a new password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {state?.ok && (
                                <div className="text-sm text-forest-900 bg-forest-50 border border-forest-100 rounded-md px-3 py-2">
                                    If an account exists for that email, you&apos;ll receive a reset link shortly. Check your inbox.
                                </div>
                            )}
                            {state?.error && (
                                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                                    <span className="shrink-0">⚠</span>
                                    {state.error}
                                </div>
                            )}

                            {!state?.ok && (
                                <form action={formAction} className="space-y-4">
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
                                    <SubmitButton />
                                </form>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-0">
                            <Separator />
                            <p className="text-sm text-center text-muted-foreground">
                                <Link href={AUTH_ROUTES.login} className="font-medium text-foreground hover:text-primary underline-offset-4 hover:underline">
                                    Back to sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
