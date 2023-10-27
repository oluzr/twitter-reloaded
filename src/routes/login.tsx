import React, { useState } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Wrapper,
  Title,
  Form,
  Input,
  Error,
  Switcher,
} from "../components/auth-component";
import GithubButton from "../components/github-btn";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [sendingEmail, setSendingEmail] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const getNewPasswordEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, sendingEmail);
      setTimeout(() => {
        setForgotPassword(false);
      }, 5000);
      
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message)
      }
    }
  };
  return (
    <Wrapper>
      <Title>Log into X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          placeholder="Email"
          type="text"
          onChange={onChange}
          required
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          onChange={onChange}
          required
        />
        <Input type="submit" value={isLoading ? "isLoading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-acount">Create one &rarr;</Link>
      </Switcher>
      <Switcher>
        Did you forgot your password?{" "}
        <a href="#none" onClick={() => setForgotPassword(true)}>
          new password &rarr;
        </a>
      </Switcher>
      {forgotPassword ? (
        <>
          <Input
            name="sending email"
            placeholder="Email for sending Password Reset Email "
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSendingEmail(e.target.value)
            }
            required
          />
          <Input
            type="submit"
            onClick={getNewPasswordEmail}
            value={forgotPassword ? "isSending..." : "Check your Email!"}
          />
        </>
      ) : null}
      <GithubButton />
    </Wrapper>
  );
};

export default Login;
