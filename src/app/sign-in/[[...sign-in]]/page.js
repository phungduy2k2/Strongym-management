"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="mt-16 flex justify-center">
      <SignIn />
    </div>
  );
}
