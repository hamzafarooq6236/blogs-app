import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth();
  if(!session){
    redirect("/auth/signin")
  }
  return (
    <div>
      <h1 className="text-black font-bold text-2xl">{session.user?.name}</h1>
      <Button variant="destructive">Button</Button>
    </div>
  )
}
