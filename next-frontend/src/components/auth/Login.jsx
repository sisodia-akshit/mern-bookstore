"use client"

import '../../styles/Login.css'
import { useState } from "react";
import Input from "../ui/Input";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/useAuthMutation";
import OAuth from './OAuth';
import AuthForm from './AuthForm';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation()

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      email,
      password,
    });
  };

  return (
    <main className="login">
      <h1 style={{ marginBottom: "1rem" }}>Log In</h1>

      <OAuth />

      <p style={{ color: "#555", marginTop: "1rem" }}>or</p>

      <AuthForm
        handleSubmit={handleSubmit}
        authButton={loginMutation.isPending ? "Logging in..." : "Log in"}
        error={loginMutation.error}
        isPending={loginMutation.isPending}
      >
        <Input type={"email"} name={email} placeholder={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type={"password"} name={password} placeholder={"Password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
      </AuthForm>

      <Link href={"/forgot-password"} style={{ color: "var(--primary-color)", marginTop:"1rem" }}>Recover Password?</Link>

      <p style={{ color: "#999", marginTop:"1rem" }}>No account ? <Link href={'/register'} style={{ margin: "10px auto", color: "var(--primary-color)" }}>Create</Link> </p>
    </main>
  );
};

export default Login;
