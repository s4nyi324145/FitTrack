'use server'


import { signIn, signOut } from "@/lib/auth";



export async function doSocialLogin(formData: FormData) {

    const action= formData.get("action");

    if(!action || typeof action !== "string") {
        throw new Error("Invalid provider");
    }

    await signIn(action, {
        redirectTo: "/onboarding",
    });
    
}

export async  function doLogOut() {

}