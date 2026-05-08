import { ProfilePage } from "@/components/layout/ProfilePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile — ArriveFrance",
    description: "Manage your personal, academic and stay information.",
};

export default function Profile() {
    return <ProfilePage />;
}
