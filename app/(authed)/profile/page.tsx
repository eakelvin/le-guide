import { ProfilePage } from "@/components/layout/Profile/ProfilePage";
import { requireAppUser } from "@/lib/auth/session";
import { getMyProfileAction } from "@/features/profile/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile — ArriveFrance",
    description: "Manage your personal, academic and stay information.",
};

export default async function Profile() {
    const appUser = await requireAppUser();
    const initialProfile = await getMyProfileAction();
    return <ProfilePage appUser={appUser} initialProfile={initialProfile} />;
}
