import { type FormEventHandler, useState } from "react";

import toast from "react-hot-toast";
import { api } from "@/utils/api";

function Register() {
  const { mutate: register, isLoading: isRegistering } =
    api.auth.register.useMutation();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate: resendEmail } =
    api.auth.resendVerificationEmail.useMutation();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!email || !password || !username) return;
    if (password !== confirmPassword) {
      toast.success("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    register(
      {
        email,
        password,
        username,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleResendEmail = (email: string) => {
    resendEmail(
      { email },
      {
        onSuccess: (data) => {
          console.log(data);
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
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          placeholder="Username"
          className="input-bordered input"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserName(event.target.value)
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
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          className="input-bordered input"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(event.target.value)
          }
        />
      </div>

      <label
        htmlFor="my-modal"
        className="link-hover label-text-alt link pt-10"
      >
        Resend Verification Email
      </label>

      <div className="form-control mt-6">
        <button className="btn-primary btn" disabled={isRegistering}>
          Register
        </button>
      </div>

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Missing an Email?</h3>
          <p className="py-8">
            Help fill in your email so that we can resend the verification email
          </p>
          <input
            onChange={(value) => setResetEmail(value.target.value)}
            type="text"
            placeholder="Type here"
            className="input w-full max-w-xs"
          />
          <label
            htmlFor="my-modal"
            className="btn-success btn ms-5 px-10"
            onClick={() => handleResendEmail(resetEmail)}
          >
            Send
          </label>
        </label>
      </label>
    </form>
  );
}

export default Register;
