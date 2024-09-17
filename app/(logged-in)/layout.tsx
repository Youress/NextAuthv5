import Link from "next/link";
import React from "react";
import LogoutButton from "./logout-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface children {
  children: React.ReactNode;
}

const LoggedInLayout = async ({ children }: children) => {
  const session = await auth();
  console.log({session})
  if(!session?.user?.id){
    redirect("/login")
}

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-200 flex justify-between items-center py-2 px-4">
        <ul className="flex gap-4 font-sans font-medium">
          <li>
            <Link href="/account">My Account</Link>
          </li>
          <li>
            <Link href="/change-password">Change Password</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <div className="flex-1 flex justify-center items-center"> {children}</div>
    </div>
  );
};

export default LoggedInLayout;
