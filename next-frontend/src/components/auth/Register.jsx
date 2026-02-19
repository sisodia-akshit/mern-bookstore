"use client";

import '../../styles/Login.css'
import { useEffect, useState } from "react";
import Link from "next/link";

import Input from "../ui/Input";
import { useGenreateOtpMutation, useSignupMutation, useVarifyOtpMutation } from '@/hooks/useAuthMutation';
import OAuth from './OAuth';
import AuthForm from './AuthForm';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpAvailable, setOtpAvailability] = useState(false);
  const [isPasswordForm, setIsPasswordForm] = useState(false);
  // otp related 
  const [secondsLeft, setSecondsLeft] = useState(0);

  const generateOtpMutation = useGenreateOtpMutation({ setMessage, setSecondsLeft, setSecondsLeft });
  const verifyMutation = useVarifyOtpMutation({ setOtp, setOtpAvailability, setIsPasswordForm });
  const signupMutation = useSignupMutation({ setIsPasswordForm })

  const signupFormHandler = (e) => {
    e.preventDefault()
    generateOtpMutation.mutate({
      name,
      email
    })
  }

  const handleVarify = (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert("Enter 4-digit OTP");
      return;
    }
    const formData = JSON.parse(localStorage.getItem("signupForm"))
    verifyMutation.mutate({
      email: formData.email,
      otp
    });
  };

  const signHandler = (e) => {
    e.preventDefault()
    const formData = JSON.parse(localStorage.getItem("signupForm"))
    signupMutation.mutate({
      name: formData.name,
      email: formData.email,
      password,
    })
  }
  const handleSendOtp = async () => {
    const formData = JSON.parse(localStorage.getItem("signupForm"))
    generateOtpMutation.mutate({ name: formData.name, email: formData.email })       // your API call
    setSecondsLeft(120);       // 60 seconds cooldown
  };

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <main  >
      <section aria-labelledby="signup-heading" className="login">
        <h1 id="signup-heading" style={{ marginBottom: "1rem" }}>Sign up</h1>
        {
          (!isOtpAvailable && !isPasswordForm)
          &&
          <>
            <OAuth />

            <p style={{ color: "#555", marginTop: "1rem" }}>or</p>

            <AuthForm
              handleSubmit={signupFormHandler}
              authButton={generateOtpMutation.isPending ? "Continue..." : "Continue"}
              error={generateOtpMutation.error}
              isPending={generateOtpMutation.isPending}
            >
              <Input type={"text"} name={"name"} placeholder={"Name"} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
              <Input type={"email"} name={"email"} placeholder={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
            </AuthForm>

            <p style={{ color: "#999", marginTop: "1rem" }}>Already have account ?</p>
            <Link href={'/login'} style={{ margin: "0px auto", color: "var(--primary-color)" }}>Log In</Link>
          </>
        }

        {/* otp Form */}
        {
          (isOtpAvailable && !isPasswordForm)
          &&
          <AuthForm
            handleSubmit={handleVarify}
            authButton={verifyMutation.isPending ? "Verifying" : "Verify OTP"}
            error={verifyMutation.error}
            isPending={verifyMutation.isPending}
          >
            <p role="status" style={{ color: "#555", fontSize: ".85rem" }}>An OTP has been sent to your registered email
              <span style={{ fontStyle: "italic", color: "#555" }}> {message}</span>
            </p>

            <h2>Verify OTP</h2>
            <Input type={"text"} inputMode="numeric" pattern="[0-9]*" name={"otp"} placeholder={"Enter OTP"} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={4} />
            <button
              type="button"
              onClick={handleSendOtp}
              style={{ fontSize: "0.8rem", color: secondsLeft > 0 ? "#777" : "var(--primary-color)", cursor: "pointer" }}
              disabled={secondsLeft > 0}
              className="resendBtn"
            >
              {secondsLeft > 0 ? `${secondsLeft}` : " Resend OTP"}
            </button>
            <p style={{ color: "#333" }}>The code is valid for 5 minutes only.</p>

          </AuthForm>

        }

        {
          (!isOtpAvailable && isPasswordForm)
          &&
          <AuthForm
            handleSubmit={signHandler}
            authButton={signupMutation.isPending ? "Signing up..." : "Sign up"}
            error={signupMutation.error}
            isPending={signupMutation.isPending}
          >
            <p style={{ color: "#555", fontSize: ".85rem" }} >Create password</p>
            <Input type={"password"} name={"password"} placeholder={"Password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />


          </AuthForm>

        }
      </section>
    </main >
  );
};

export default Register;
