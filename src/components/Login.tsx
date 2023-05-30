import { type FormEventHandler, useState } from "react";

import toast from "react-hot-toast";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const { mutate: login, isLoading: isLoggingIn } =api.auth.login.useMutation();
  const { mutate: resetPassword } = api.auth.resetPassword.useMutation();
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: sendRequestPasswordEmail } = api.auth.sendRequestPasswordEmail.useMutation();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!email || !password) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    login(
      { email, password },
      {
        onSuccess: (data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
          router.push("/chat").catch(console.error);
          window.location.href = "/chat";
          toast.success(data.message);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleForgotPassword = (email: string) => {
    sendRequestPasswordEmail({ email },{
        onSuccess: (data) => {
          toast.success(data.message);
        },
        onError: (error) => {
          toast.error("Please enter a valid email");
          console.log(error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="E-mail"
          className="input-bordered input"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Password"
          className="input-bordered input"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        />
        <label
          htmlFor="my-modal-4"
          className="link-hover label-text-alt link pt-6"
        >
          Forgot Password?
        </label>
      </div>
      <div className="form-control mt-6">
        <button className={`btn-primary btn ${isLoggingIn ? "loading" : ""}`}>
          Login
        </button>
      </div>
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />

      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Forgot your Password?</h3>
          <p className="py-8">Enter email you typed in to reset password</p>
          <input
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setResetEmail(event.target.value)
            }
            type="text"
            placeholder="Type here"
            className="input w-full max-w-xs"
          />
          <label
            htmlFor="my-modal-4"
            className="btn-success btn ms-5 px-10"
            onClick={() => handleForgotPassword(resetEmail)}
          >
            Send
          </label>
        </label>
      </label>
    </form>
  );
}

export default Login;
