"use client";

import Banner from "@/components/banner";
import MemberHeader from "@/components/member-header";
import { GlobalContext } from "@/context";
import { useContext } from "react";

export default function Home() {

  const { isAuthUser } = useContext(GlobalContext)
  
  return (
    <div className="flex flex-col w-full items-center">
      <MemberHeader/>
      <Banner />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
      </main>
      
    </div>
  )
}
