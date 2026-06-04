import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireAppUser } from "@/features/auth/session";
import { getActiveChecklist } from "@/features/checklist/queries";
import { getMyProgress } from "@/features/progress/queries";
import { getMyProfileAction } from "@/features/profile/actions";
import { applyProfileDerivedCompletions } from "@/lib/helpers/checklist-helpers";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ signedIn?: string; passwordUpdated?: string }>;
}) {
    const { signedIn, passwordUpdated } = await searchParams;
    const [user, checklist, dbProgress, initialProfile] = await Promise.all([
        requireAppUser(),
        getActiveChecklist(),
        getMyProgress(),
        getMyProfileAction(),
    ]);

    // Layer profile-driven completions (e.g. hasAccommodation) on top of the
    // DB-fetched progress so the checklist reflects what the profile implies.
    const initialProgress = applyProfileDerivedCompletions(dbProgress, initialProfile);

    return (
        <DashboardShell
            initialUser={user}
            initialChecklist={checklist}
            initialProgress={initialProgress}
            initialProfile={initialProfile}
            showSignedInToast={signedIn === "1"}
            showPasswordUpdatedToast={passwordUpdated === "1"}
        />
    );
}
