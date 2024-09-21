"use server"

import { auth } from "@/auth"
import prisma from "@/prisma/client"
import { randomBytes } from "crypto"

export const passwordReset = async (emailAddress : string) => {
const session = await auth()
if(!!session?.user?.id){
    return {
        error : true,
        message : "You are already logged in"
    }
}
const user = await prisma.user.findUnique({
    where : {
        email  : emailAddress
    }
})
if(!user){
    return;
}
const passwordResetToken = randomBytes(32).toString("hex")
console.log(passwordResetToken)
}