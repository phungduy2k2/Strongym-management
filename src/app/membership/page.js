import Membership from "@/components/card/membership-card";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MembershipPage() {
  const user = await currentUser();
  if(user) {
    const userInfo = await getUserById(user.id);

    return (
      <Membership userInfo={userInfo.data} />
    );
  } else redirect("/")
}
