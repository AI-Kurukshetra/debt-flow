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

  if (customUser || user) {
    redirect("/dashboard");
  }

  if (resolvedSearchParams?.needSignIn) {
    redirect("/login?needSignIn=1");
  }

  redirect("/login");
}
