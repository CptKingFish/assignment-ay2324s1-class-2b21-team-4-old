import { type FormEventHandler, useState } from "react";
import { setCookie } from "cookies-next";

import toast from "react-hot-toast";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const { mutate: login, isLoading: isLoggingIn } =
    api.user.login.useMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          localStorage.setItem("token", data.token);
          setCookie("token", data.token, {
            // expire in 1 day
            expires: new Date(Date.now() + 86400),
          });
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
        <label className="label">
          <a href="#" className="link-hover label-text-alt link">
            Forgot password?
          </a>
        </label>
      </div>
      <div className="form-control mt-6">
        <button className={`btn-primary btn ${isLoggingIn ? "loading" : ""}`}>
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;
