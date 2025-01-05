import TrainerBlog from "@/components/trainer/blog";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function TrainerBlogPage() {
    const user = await currentUser()
    const response = await getUserById(user.id)

    return <TrainerBlog userInfo={response.data}/>;
}
