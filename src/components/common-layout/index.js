import { currentUser } from "@clerk/nextjs/server";
import MemberHeader from "../member-header";
import * as React from "react";

async function CommonLayout({ children }) {
  const user = await currentUser();
  

  return (
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        {/*Header Component*/}
        <MemberHeader
          user={JSON.parse(JSON.stringify(user))}
        />

        {/*Main Content*/}
        <main>{children}</main>

      </div>
  );
}

export default CommonLayout;
