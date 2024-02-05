import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function Users() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  const { data: users } = await supabase.from("profiles").select("*").order("id", { ascending: false });
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Users List</TypographyH2>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {/* {species?.map((species) => <SpeciesCard userId={sessionId} key={species.id} species={species} />)} */}
        <Table>
          <TableCaption>Users on Biodiversity Hub</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Email</TableHead>
              <TableHead className="w-[20%]">Name</TableHead>
              <TableHead className="w-[60%]">Biography</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.display_name}</TableCell>
                <TableCell className="text-right">{user.biography}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
