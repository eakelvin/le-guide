import { DashboardShell } from "@/components/layout/DashboardShell";
import { getAppUser } from "@/lib/supabase/user";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ signedIn?: string; passwordUpdated?: string }>;
}) {
    const { signedIn, passwordUpdated } = await searchParams;
    const user = await getAppUser();
    return (
        <DashboardShell
            initialUser={user}
            showSignedInToast={signedIn === "1"}
            showPasswordUpdatedToast={passwordUpdated === "1"}
        />
    );
}