import Banner from "@/components/banner";
import { Fragment } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { getUserById } from "@/services/user";
import { redirect } from "next/navigation";
import Notification from "@/components/Notification";

async function Home() {
  const user = await currentUser();
  
  const response = await getUserById(user?.id);
  if (user && !response.success) {
    redirect("/onboard");
  } else {
    const userInfo = response.data;
    if (userInfo?.role === "manager" || userInfo?.role === "trainer") redirect("/admin");
  }
  return (
    <Fragment>
      <section>
        <div className="flex flex-col w-full mt-16 items-center">
          <Banner />
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
        </div>
        <Notification />
      </section>
    </Fragment>
  );
}

export default Home;
