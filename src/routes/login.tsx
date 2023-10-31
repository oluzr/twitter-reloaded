import React, { useState } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
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

  return (
    <Wrapper>
      <Title>Log into 🍅</Title>
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
        <Link to="/send-pwd-resetEmail">find &rarr;</Link>
      </Switcher>

      <GithubButton />
    </Wrapper>
  );
};

export default Login;
