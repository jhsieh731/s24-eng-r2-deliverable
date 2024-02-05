import type { Database } from "@/lib/schema";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import SpeciesListChild from "./species-list";

// custom type to allow for extended search on profiles
export interface Species {
  author: string;
  common_name: string | null;
  description: string | null;
  endangered: boolean | null;
  id: number;
  image: string | null;
  kingdom: Database["public"]["Enums"]["kingdom"];
  scientific_name: string;
  total_population: number | null;
  profiles: {
    biography: string | null;
    display_name: string | null;
  } | null;
}

export default async function SpeciesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;

  // select info on all species & associated author
  const { data: species } = await supabase
    .from("species")
    .select(`*, profiles!inner (display_name, biography)`)
    .order("id", { ascending: false });

  // render actual content in client component (for sorting & filtering)
  return <SpeciesListChild sessionId={sessionId} species={species ?? []} />;
}
