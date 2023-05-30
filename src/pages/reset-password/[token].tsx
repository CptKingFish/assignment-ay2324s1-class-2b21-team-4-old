import React from "react";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const Token = () => {
  const { mutate, isLoading } = api.auth.resetPassword.useMutation();
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    mutate(
      {
        token: token as string,
        password,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.push("/authenticate").catch(console.error);
        },
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="input-bordered input w-full max-w-xs"
        />
        <input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="input-bordered input w-full max-w-xs"
        />

        <button disabled={isLoading} className="btn" onClick={handleSubmit}>
          Change Password
        </button>
      </div>
    </>
  );
};

export default Token;
