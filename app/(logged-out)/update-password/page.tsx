import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/prisma/client";
import Link from "next/link";
import UpdatePasswordForm from "./update-password-form";

interface Token {
  searchParams: {
    token?: string;
  };
}
const UpdatePassword = async ({ searchParams }: Token) => {
  const { token } = searchParams;
  let tokenIsValid = false;

  if (token) {
    const passwordToken = await prisma.token.findFirst({
      where: {
        token: token,
      },
    });
    const now = Date.now()
    if(!!passwordToken?.token && now < passwordToken.expiration.getTime() ){
        tokenIsValid = true;
    }
  }

  console.log("token", searchParams);
  return (
    <main className="flex justify-center items-center min-h-screen">
         <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>
                    {tokenIsValid ? "Update password" :"Your password reset link is invalid or has expired" }
                </CardTitle>
            </CardHeader>
            <CardContent>
                {tokenIsValid ? <UpdatePasswordForm token={token ?? ""}/> : <Link className="underline" href="/password-reset">Request another password reset link</Link>}
            </CardContent>
         </Card>
    </main>
  )
};

export default UpdatePassword;
