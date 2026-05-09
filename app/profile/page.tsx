import { ProfilePage } from "@/components/layout/ProfilePage";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile — ArriveFrance",
    description: "Manage your personal, academic and stay information.",
};

export default async function Profile() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.auth.getUser();
    const hasEmailPasswordIdentity =
        data.user != null && (data.user.identities ?? []).some((i) => i.provider === "email");

    return <ProfilePage hasEmailPasswordIdentity={hasEmailPasswordIdentity} />;
}
