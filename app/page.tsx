import { LandingPage } from "@/components/layout/LandingPage";
import { getAppUser } from "@/features/auth/user";

export default async function Home() {
  const user = await getAppUser();
  return <LandingPage initialUser={user} />;
}
