"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
    Eye, EyeOff, ArrowRight, Mail, Lock,
    User, GraduationCap, CheckCircle2,
    KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { cn } from "@/lib/utils";
import { RegisterPanel } from "../layout/LeftPanel";
import { CountryCombobox } from "@/components/ui/CountryCombobox";
import { registerAction } from "@/features/auth/register";
import { googleLogin } from "@/features/auth/google-login";

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            size="lg"
            className={cn("flex-1 font-medium", pending && "opacity-80")}
            disabled={pending || disabled}
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account…
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="size-4" aria-hidden />
                </span>
            )}
        </Button>
    );
}

/* ─── Password strength ──────────────────────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: "Weak", color: "bg-coral-400" };
    if (score <= 3) return { score, label: "Fair", color: "bg-gold-200" };
    return { score, label: "Strong", color: "bg-forest-400" };
}

/* ─── Register form ──────────────────────────────────────────────────── */
type Step = 1 | 2;

export function RegisterForm() {
    const [step, setStep] = useState<Step>(1);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [agreed, setAgreed] = useState(false);

    /* Step 1 fields */
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    /* Step 2 fields */
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [university, setUniversity] = useState("");
    const [country, setCountry] = useState("");

    const strength = getStrength(password);
    const pwMatch = password && confirm && password === confirm;
    const pwNoMatch = confirm && password !== confirm;

    /* Step 1 validation */
    function handleStep1(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setStep(2);
    }

    /* Step 2 / final submit */
    function handleSubmitClientValidation() {
        setError(null);
        if (!password || !confirm) { setError("Please fill in all fields."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }
        if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
        if (!agreed) { setError("Please accept the Terms of Service."); return; }
    }

    const [serverState, formAction] = useActionState(registerAction, {});
    const mergedError = error ?? serverState?.error ?? null;

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <RegisterPanel />

            {/* Right panel */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-[420px] animate-fade-up">

                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="no-underline">
                            <span className="font-serif text-2xl font-light tracking-tight text-foreground">
                                Arrive<span className="text-forest-900">France</span>
                            </span>
                        </Link>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        {([1, 2] as Step[]).map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                                        s < step
                                            ? "bg-forest-600 text-white"
                                            : s === step
                                                ? "bg-forest-900 text-white"
                                                : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {s < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                                </div>
                                <span className={cn("text-[12px]", s === step ? "text-foreground font-medium" : "text-muted-foreground")}>
                                    {s === 1 ? "Your info" : "Account"}
                                </span>
                                {s < 2 && <div className="w-8 h-px bg-border mx-1" />}
                            </div>
                        ))}
                    </div>

                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl font-normal tracking-tight">
                                {step === 1 ? "Create your account" : "Secure your account"}
                            </CardTitle>
                            <CardDescription>
                                {step === 1
                                    ? "Free forever — no credit card needed"
                                    : "Choose a strong password to protect your data"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            {/* ── STEP 1 ── */}
                            {step === 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full font-normal"
                                        type="button"
                                        onClick={() => googleLogin("/dashboard")}
                                    >
                                        <KeyRound className="size-4" aria-hidden />
                                        Continue with Google
                                    </Button>

                                    <div className="relative">
                                        <Separator />
                                        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                                            or register with email
                                        </span>
                                    </div>

                                    {mergedError && (
                                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                                            <span className="shrink-0">⚠</span> {mergedError}
                                        </div>
                                    )}

                                    <form onSubmit={handleStep1} className="space-y-4">
                                        {/* Name row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        id="firstName"
                                                        placeholder="Mia"
                                                        className="pl-9"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        autoComplete="given-name"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last name</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Andersson"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    autoComplete="family-name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
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
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" size="lg" className="w-full font-medium">
                                            Continue
                                            <ArrowRight className="size-4" aria-hidden />
                                        </Button>
                                    </form>
                                </>
                            )}

                            {/* ── STEP 2 ── */}
                            {step === 2 && (
                                <>
                                    {mergedError && (
                                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                                            <span className="shrink-0">⚠</span> {mergedError}
                                        </div>
                                    )}

                                    <form action={formAction} onSubmit={handleSubmitClientValidation} className="space-y-4">
                                        <input type="hidden" name="firstName" value={firstName} />
                                        <input type="hidden" name="lastName" value={lastName} />
                                        <input type="hidden" name="email" value={email} />
                                        <input type="hidden" name="university" value={university} />
                                        <input type="hidden" name="country" value={country} />

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="password"
                                                    type={showPw ? "text" : "password"}
                                                    placeholder="Min. 8 characters"
                                                    className="pl-9 pr-9"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPw(!showPw)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Strength bar */}
                                            {password && (
                                                <div className="space-y-1.5">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <div
                                                                key={i}
                                                                className={cn(
                                                                    "flex-1 h-1 rounded-full transition-all duration-300",
                                                                    i <= strength.score ? strength.color : "bg-muted"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className={cn(
                                                        "text-[11px] font-medium",
                                                        strength.score <= 1 ? "text-coral-600" :
                                                            strength.score <= 3 ? "text-gold-600" : "text-forest-600"
                                                    )}>
                                                        {strength.label} password
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm">Confirm password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="confirm"
                                                    type={showConfirm ? "text" : "password"}
                                                    placeholder="Repeat password"
                                                    className={cn(
                                                        "pl-9 pr-9",
                                                        pwNoMatch && "border-destructive focus-visible:ring-destructive",
                                                        pwMatch && "border-forest-400 focus-visible:ring-forest-400"
                                                    )}
                                                    value={confirm}
                                                    onChange={(e) => setConfirm(e.target.value)}
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirm(!showConfirm)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {pwNoMatch && (
                                                <p className="text-[11px] text-destructive">Passwords do not match</p>
                                            )}
                                            {pwMatch && (
                                                <p className="text-[11px] text-forest-600 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                                                </p>
                                            )}
                                        </div>

                                        {/* Optional: university + country */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="university">
                                                    University <span className="text-muted-foreground font-normal">(optional)</span>
                                                </Label>
                                                <div className="relative">
                                                    <GraduationCap className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="university"
                                                        placeholder="Sciences Po"
                                                        className="pl-9"
                                                        value={university}
                                                        onChange={(e) => setUniversity(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="register-country">
                                                    Country <span className="text-muted-foreground font-normal">(optional)</span>
                                                </Label>
                                                <CountryCombobox
                                                    id="register-country"
                                                    value={country}
                                                    onChange={setCountry}
                                                    placeholder="Select country…"
                                                />
                                            </div>
                                        </div>

                                        {/* Terms */}
                                        <div className="flex items-start space-x-2 pt-1">
                                            <Checkbox
                                                id="terms"
                                                checked={agreed}
                                                onCheckedChange={(v) => setAgreed(v === true)}
                                                className="mt-0.5"
                                            />
                                            <Label
                                                htmlFor="terms"
                                                className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer"
                                            >
                                                I agree to the{" "}
                                                <Link href="/terms" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                                                    Terms of Service
                                                </Link>{" "}
                                                and{" "}
                                                <Link href="/privacy" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                                                    Privacy Policy
                                                </Link>
                                            </Label>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() => { setError(null); setStep(1); }}
                                            >
                                                Back
                                            </Button>
                                            <SubmitButton disabled={!agreed} />
                                        </div>
                                    </form>
                                </>
                            )}
                        </CardContent>

                        <CardFooter className="flex flex-col gap-3 pt-0">
                            <Separator />
                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href={AUTH_ROUTES.login}
                                    className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
                        LeGuide is free and never shares your data with third parties.
                    </p>
                </div>
            </div>
        </div>
    );
}
