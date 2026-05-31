import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireAppUser } from "@/features/auth/session";
import { getActiveChecklist } from "@/features/checklist/queries";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ signedIn?: string; passwordUpdated?: string }>;
}) {
    const { signedIn, passwordUpdated } = await searchParams;
    const [user, checklist] = await Promise.all([
        requireAppUser(),
        getActiveChecklist(),
    ]);
    // console.log("user", user);
    // console.log("checklist", checklist);
    return (
        <DashboardShell
            initialUser={user}
            initialChecklist={checklist}
            showSignedInToast={signedIn === "1"}
            showPasswordUpdatedToast={passwordUpdated === "1"}
        />
    );
}
