import Notification from "@/components/Notification";
import OnBoard from "@/components/on-board";
import { getUserById } from "@/services/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnBoardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const response = await getUserById(user?.id);
  if (response.success) {
    const userInfo = response.data;
    if (userInfo.memberId !== null) redirect("/");
  }
  
  return ( //chưa có bản ghi User thì phải onboard trước
    <div>
      <OnBoard user={JSON.parse(JSON.stringify(user))} />
      <Notification />
    </div>
  );
}
