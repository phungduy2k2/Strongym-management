"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="mt-16 flex justify-center">
      <SignUp />
    </div>
  );
}
