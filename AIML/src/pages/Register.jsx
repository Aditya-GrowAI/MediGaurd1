import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div className="auth-clerk-container">
      <SignUp
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}