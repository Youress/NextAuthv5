import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";

const Myaccount = async () => {
  const session = await auth();
  return (
    <Card className="w-[350px]">
      <CardHeader><CardTitle>My Account</CardTitle></CardHeader>
        
        <CardContent>
          <Label>Email Adress</Label>
          <div className="text-muted-foreground">{session?.user?.email}</div>
        </CardContent>
      
    </Card>
  );
};

export default Myaccount;
