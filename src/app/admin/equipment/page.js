import Equipment from "@/components/equipment";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function EquipmentPage() {
    const user = await currentUser()
    const response = await getUserById(user.id)

    return (
        <Equipment userInfo={response.data} />
    )
}
