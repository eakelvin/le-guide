import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireAppUser } from "@/features/auth/session";
import { getActiveChecklist } from "@/features/checklist/queries";
import { getMyProgress } from "@/features/progress/queries";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ signedIn?: string; passwordUpdated?: string }>;
}) {
    const { signedIn, passwordUpdated } = await searchParams;
    const [user, checklist, initialProgress] = await Promise.all([
        requireAppUser(),
        getActiveChecklist(),
        getMyProgress(),
    ]);
    return (
        <DashboardShell
            initialUser={user}
            initialChecklist={checklist}
            initialProgress={initialProgress}
            showSignedInToast={signedIn === "1"}
            showPasswordUpdatedToast={passwordUpdated === "1"}
        />
    );
}
