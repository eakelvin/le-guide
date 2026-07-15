"use client";

import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { LoginPanel } from "@/components/layout/LeftPanel";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
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
import { updatePasswordAction } from "@/features/auth/update-password";

function SubmitButton({ label }: { label: string }) {
    const t = useTranslations("auth");
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className={cn("w-full font-medium transition-all", pending && "opacity-80")} size="lg" disabled={pending}>
            {pending ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {t("updatingPassword")}
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    {label}
                    <ArrowRight className="size-4" aria-hidden />
                </span>
            )}
        </Button>
    );
}

type Props = {
    next: string;
    variant?: "page" | "embedded";
    requireCurrentPasswordField?: boolean;
    recoveryFlow?: boolean;
};

export function UpdatePasswordForm({
    next,
    variant = "page",
    requireCurrentPasswordField = true,
    recoveryFlow = false,
}: Props) {
    const t = useTranslations("auth");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [state, formAction] = useActionState(updatePasswordAction, {});

    const title = t("setNewPasswordTitle");
    const description = recoveryFlow
        ? t("setNewPasswordRecoveryDesc")
        : requireCurrentPasswordField
            ? t("setNewPasswordWithCurrentDesc")
            : t("setNewPasswordDesc");
    const submitLabel = recoveryFlow || !requireCurrentPasswordField
        ? t("saveNewPassword")
        : t("updatePassword");

    const formInner = (
        <>
            {state?.error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                    <span className="shrink-0">⚠</span>
                    {state.error}
                </div>
            )}
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="next" value={next} />
                {requireCurrentPasswordField && (
                    <div className="space-y-2">
                        <Label htmlFor="current-password">{t("currentPassword")}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="current-password"
                                name="current_password"
                                type={showCurrent ? "text" : "password"}
                                placeholder={t("currentPasswordPlaceholder")}
                                className="pl-9 pr-9"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                                aria-label={showCurrent ? t("hidePassword") : t("showPassword")}
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="new-password">{t("newPassword")}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="new-password"
                            name="password"
                            type={showPw ? "text" : "password"}
                            placeholder={t("minPasswordChars")}
                            className="pl-9 pr-9"
                            autoComplete="new-password"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                            aria-label={showPw ? t("hidePassword") : t("showPassword")}
                        >
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="confirm-password"
                            name="confirm"
                            type={showConfirm ? "text" : "password"}
                            placeholder={t("repeatPassword")}
                            className="pl-9 pr-9"
                            autoComplete="new-password"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                            aria-label={showConfirm ? t("hidePassword") : t("showPassword")}
                        >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <SubmitButton label={submitLabel} />
            </form>
        </>
    );

    if (variant === "embedded") {
        return <div className="space-y-4">{formInner}</div>;
    }

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
                            <CardTitle className="text-2xl font-normal tracking-tight">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">{formInner}</CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-0">
                            <Separator />
                            <p className="text-sm text-center text-muted-foreground">
                                <Link href={AUTH_ROUTES.login} className="font-medium text-foreground hover:text-primary underline-offset-4 hover:underline">
                                    {t("backToSignIn")}
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
