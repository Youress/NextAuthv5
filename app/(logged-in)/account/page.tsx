import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";
import TwoFactorAuthForm from "./two-actor-auth-form";
import prisma from "@/prisma/client";


const Myaccount = async () => {
  const session = await auth();

  const user  = await prisma.user.findUnique({
    where : {
      id : parseInt(session!.user!.id!)
    }
  })
  return (
    <Card className="w-[350px]">
      <CardHeader><CardTitle>My Account</CardTitle></CardHeader>
        <CardContent>
          <Label>Email Adress</Label>
          <div className="text-muted-foreground">{session?.user?.email}</div>
          <TwoFactorAuthForm twoFactorActivated={user!.TwoFactorAuthActivated ?? false}/>
        </CardContent>
    </Card>
  );
};

export default Myaccount;
