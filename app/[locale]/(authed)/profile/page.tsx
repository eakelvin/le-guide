import { ProfilePage } from "@/components/layout/Profile/ProfilePage";
import { requireAppUser } from "@/features/auth/session";
import { getMyProfileAction } from "@/features/profile/actions";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("profile");
    return {
        title: t("metaTitle"),
        description: t("metaDescription"),
    };
}

export default async function Profile() {
    const appUser = await requireAppUser();
    const initialProfile = await getMyProfileAction();
    return <ProfilePage appUser={appUser} initialProfile={initialProfile} />;
}
