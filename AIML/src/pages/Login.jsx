import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="auth-clerk-container">
      <SignIn
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}