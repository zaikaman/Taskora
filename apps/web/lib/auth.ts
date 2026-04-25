import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken) {
        return null;
    }

    return {
        user: {
            id: "mock-user-id",
            role: "developer"
        }
    };
}

export async function requireAuth() {
    const session = await getAuthSession();

    if (!session) {
        redirect("/");
    }

    return session;
}
