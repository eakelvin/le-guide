import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireAppUser } from "@/lib/auth/session";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ signedIn?: string; passwordUpdated?: string }>;
}) {
    const { signedIn, passwordUpdated } = await searchParams;
    const user = await requireAppUser();
    return (
        <DashboardShell
            initialUser={user}
            showSignedInToast={signedIn === "1"}
            showPasswordUpdatedToast={passwordUpdated === "1"}
        />
    );
}
