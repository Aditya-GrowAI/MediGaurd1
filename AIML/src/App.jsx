import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/clerk-react";
import SignUpPage from "./pages/Register";
import SignInPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";

// Protect a route — redirect to Clerk sign-in if not authenticated
function ProtectedRoute({ children }) {
  return (
    <>
      <ClerkLoading>
        <div style={{
          minHeight: "100vh",
          background: "#0b0f1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.2rem"
        }}>
          Loading...
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default: go to sign-up */}
        <Route path="/" element={<Navigate to="/sign-up" />} />

        {/* Sign Up */}
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Sign In */}
        <Route path="/sign-in" element={<SignInPage />} />

        {/* Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}