import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LoggedOutLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()
    if(!!session?.user?.id){
        redirect("/account")
    }
  return <div>{children}</div>;
};

export default LoggedOutLayout;
