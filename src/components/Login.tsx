import { type FormEventHandler, useState } from "react";

import toast from "react-hot-toast";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const { mutate: login, isLoading: isLoggingIn } =
 api.auth.login.useMutation();
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
