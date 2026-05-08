import { LandingPage } from "@/components/layout/LandingPage";
import { getAppUser } from "@/lib/supabase/user";

export default async function Home() {
  const user = await getAppUser();
  return <LandingPage initialUser={user} />;
}
