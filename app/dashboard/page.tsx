import { DashboardShell } from "@/components/layout/DashboardShell";
import { getAppUser } from "@/features/auth/user";

const DashboardPage = async () => {
    const user = await getAppUser();
    return <DashboardShell initialUser={user} />;
}

export default DashboardPage