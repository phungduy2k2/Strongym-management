import Class from "@/components/class";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ClassPage() {
  const user = await currentUser();
  if (user) {
    const userInfo = await getUserById(user.id);

    return (
        <Class userInfo={userInfo.data} />
    );
  } else redirect("/");
}
