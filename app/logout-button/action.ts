"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    // signOut() it's only get call from server, we cannot call it from client component.
await signOut()
}