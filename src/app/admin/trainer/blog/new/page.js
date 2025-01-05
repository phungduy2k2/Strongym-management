import NewBlogComponent from "@/components/trainer/blog/new";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";


export default async function NewBlogPage() {
    const user = await currentUser()
    const response = await getUserById(user.id)

  return <NewBlogComponent userInfo={response.data} />
}
