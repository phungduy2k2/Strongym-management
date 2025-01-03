import TrainerClass from "@/components/trainer/class";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function TrainerClassPage() {
    const user = await currentUser()
    const response = await getUserById(user.id)    

    return <TrainerClass userInfo={response.data}/>;
}
