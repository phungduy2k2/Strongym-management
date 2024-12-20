import Event from "@/components/event-page";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server"

export default async function AdminEventPage() {
    const user = await currentUser()
    const userInfoResponse = await getUserById(user.id);

    return <Event userInfo={userInfoResponse.data} />
}
