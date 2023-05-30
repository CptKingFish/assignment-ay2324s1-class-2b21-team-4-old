import React from "react";
import { toast } from "react-hot-toast"
import { api } from "@/utils/api";


const Token = (token: string) => {
  const { mutate, isLoading } = api.auth.resetPassword.useMutation();
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

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
        token ,
        password,
      },
      {
        onSuccess: (data) => {
          window.location.href =
            "/authenticate?message=" + data.message + "&type=SUCCESS";
        },
        onError: (e) => {
          toast.error(e.message);
        },
      }
    );
  };

  return (
    <>
    <input type="text" onChange={(e) => setPassword(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
    <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
  
     
      <button disabled={isLoading} className="btn" onClick={() => handleSubmit(password)}>
        Change Password
      </button>
    </>
  );
};

export default Token;
