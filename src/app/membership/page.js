import Membership from "@/components/card/membership-card";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function MembershipPage() {
  const user = await currentUser();
  const userInfo = await getUserById(user.id);
  
  return (
    <Membership userInfo={userInfo.data} />
  );
}
