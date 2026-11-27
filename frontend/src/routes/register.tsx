
import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/register-api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (fullName.trim().length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      await navigate({ to: "/login" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf6] p-6">
      <div className="w-full max-w-md rounded-2xl border border-[#e0e9e5] bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#17394a]">
            SAHYOG AI
          </h1>
          <p className="mt-2 text-sm text-[#637b87]">
            Distress Assessment & Human Support
          </p>
        </div>

        <h2 className="mb-2 text-2xl font-semibold text-[#17394a]">
          Create your account
        </h2>

        <p className="mb-6 text-sm text-[#637b87]">
          Register as a responder to access your workspace.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              maxLength={128}
              required
            />
            <p className="text-xs text-[#637b87]">
              Minimum 8 characters.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#147f78] hover:bg-[#105c59]"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#637b87]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#147f78] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
