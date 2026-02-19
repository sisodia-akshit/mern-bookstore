import { useAuth } from "@/context/AuthContext";
import { createUser, generateOtp, loginUser, verifyOtp } from "@/services/authApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLoginMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      login();
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useSignupMutation = ({ setIsPasswordForm }) => {
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      localStorage.removeItem("signupForm");
      setIsPasswordForm(false);
      router.push("/login");
    },
  });
};
export const useGenreateOtpMutation = ({
  setMessage,
  setSecondsLeft,
}) => {
  return useMutation({
    mutationFn: generateOtp,
    onSuccess: (data) => {
      setMessage(data.otpSentTo);
      localStorage.setItem("signupForm", JSON.stringify(data.signupForm));
      setSecondsLeft(120);
      setOtpAvailability(true);
    },
  });
};
export const useVarifyOtpMutation = ({
  setOtp,
  setOtpAvailability,
  setIsPasswordForm,
}) => {
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setOtp("");
      setOtpAvailability(false);
      setIsPasswordForm(true);
    },
  });
};
export const useForgetPasswordMutation = ({ setOpen, setMessage }) => {
  return useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data) => {
      setMessage(data.message);
      setOpen(true);
    },
  });
};
export const useResetPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      router.push("/login");
    },
  });
};
