"use client";

import { Navbar } from "@/components/layout/Navbar";
import type { AppUser } from "@/lib/supabase/user";
import { Footer } from "./Footer";
import { Hero, UrgencyBanner, Processes, HowItWorks, Testimonials, FAQ, CTASection } from "./LandingComps";

export function LandingPage({ initialUser }: { initialUser: AppUser | null }) {
    return (
        <div className="min-h-screen bg-canvas text-foreground">
            <Navbar initialUser={initialUser} />
            <Hero />
            <UrgencyBanner />
            <Processes />
            <HowItWorks />
            <Testimonials />
            <FAQ />
            <CTASection />
            <Footer />
        </div>
    );
}
