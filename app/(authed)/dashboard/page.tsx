import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireAppUser } from "@/features/auth/session";
import { getActiveChecklist } from "@/features/checklist/queries";
import { getMyProgress } from "@/features/progress/queries";
import { getMyProfileAction } from "@/features/profile/actions";

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ signedIn?: string; passwordUpdated?: string; item?: string }>;
}) {
    const { signedIn, passwordUpdated, item } = await searchParams;
    const [user, checklist, dbProgress, initialProfile] = await Promise.all([
        requireAppUser(),
        getActiveChecklist(),
        getMyProgress(),
        getMyProfileAction(),
    ]);

    // Deep-link from a guide back to a specific checklist step: /dashboard?item=<slug|id>.
    // Resolve here so the SSR'd shell paints directly on the right view.
    const requestedItem = item?.trim();
    const resolved = requestedItem
        ? checklist.find((it) => it.slug === requestedItem || it.id === requestedItem)
        : null;
    const initialActiveView = resolved ? resolved.slug : "home";

    return (
        <DashboardShell
            initialUser={user}
            initialChecklist={checklist}
            initialProgress={dbProgress}
            initialProfile={initialProfile}
            initialActiveView={initialActiveView}
            showSignedInToast={signedIn === "1"}
            showPasswordUpdatedToast={passwordUpdated === "1"}
        />
    );
}
