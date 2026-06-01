"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Mail, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactAction } from "@/features/contact/actions";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className={cn(
        "h-auto w-full rounded-full bg-forest-900 px-7 py-3.5 text-[15px] text-white hover:bg-forest-800 sm:w-auto",
        pending && "opacity-80",
      )}
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Sending…
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Send message
          <ArrowRight className="size-4" aria-hidden />
        </span>
      )}
    </Button>
  );
}

export function ContactSection() {
  const [state, formAction] = useActionState(submitContactAction, {});
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      setShowSuccess(true);
      formRef.current?.reset();
    }
  }, [state?.ok]);

  return (
    <section id="contact" className="border-t border-sand-100 bg-sand-50 py-24">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-start gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
        <div>
          <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-600">
            Contact
          </div>
          <h2 className="font-heading mb-4 text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-sand-800">
            Questions? We&apos;re here to help.
          </h2>
          <p className="mb-8 max-w-[440px] text-[16px] leading-relaxed text-sand-600">
            Whether you&apos;re stuck on OFII, CAF, or just planning your arrival — send us a message and
            we&apos;ll get back to you as soon as we can.
          </p>
          {/* <a
            href="mailto:hello@leguide.com"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-forest-900 no-underline transition-colors hover:text-forest-700"
          >
            <Mail className="size-4" aria-hidden />
            hello(@)leguide.com
          </a> */}
        </div>

        <div className="rounded-xl border border-sand-200 bg-card p-6 shadow-xs md:p-8">
          {showSuccess ? (
            <div
              className="rounded-lg border border-forest-100 bg-forest-50 px-4 py-6 text-center"
              role="status"
            >
              <p className="text-[15px] font-medium text-forest-900">Message sent</p>
              <p className="mt-1 text-[14px] text-sand-600">
                Thanks for reaching out. We&apos;ll reply to your email shortly.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5 rounded-full"
                onClick={() => setShowSuccess(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form ref={formRef} action={formAction} className="space-y-4">
              {state?.error && (
                <div
                  className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  <span className="shrink-0" aria-hidden>
                    ⚠
                  </span>
                  {state.error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="pl-9"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@university.edu"
                      className="pl-9"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject (optional)</Label>
                <Input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="e.g. Visa validation question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Textarea
                    id="contact-message"
                    name="message"
                    placeholder="How can we help?"
                    className="min-h-[140px] resize-y pl-9"
                    required
                  />
                </div>
              </div>

              <SubmitButton />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
