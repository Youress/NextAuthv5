import { auth } from "@/auth";
import LoginPage from "./(logged-out)/login/page";
import { redirect } from "next/navigation";

export default async function  Home() {
  const session = await auth()
  if(!!session?.user?.id){
      redirect("/account")
  }
  return (
<LoginPage/>
  );
}
