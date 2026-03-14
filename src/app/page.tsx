import { redirect } from "next/navigation";
import { getCurrentCustomUser } from "@/lib/auth/custom";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type HomeProps = {
  searchParams?: Promise<{ needSignIn?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const customUser = await getCurrentCustomUser();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!(customUser || user);

  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    // Force move to login screen first as requested
    const loginUrl = resolvedSearchParams?.needSignIn 
      ? "/login?needSignIn=1" 
      : "/login";
    redirect(loginUrl);
  }
}
