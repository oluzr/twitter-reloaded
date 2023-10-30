import React, { useState } from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Wrapper,
  Title,
  Form,
  Input,
  Error,
  Switcher,
} from "../components/auth-component";

const SendPwdResetEmail = () => {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingEmailSuccess, setSendingEmailSuccess] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || sendingEmailSuccess) return;
    setSendingEmailSuccess(false)
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSendingEmailSuccess(true)
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
      <Title>Reset password</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          placeholder="Email"
          type="text"
          onChange={onChange}
          required
          disabled={sendingEmailSuccess}
          value={email}
          
        />
        <Input
          className={sendingEmailSuccess?'checked':''}
          type="submit"
          value={
            sendingEmailSuccess
              ? "Check your Email !"
              : isLoading
              ? "Sending..."
              : "Send"
          }
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Back to <Link to="/login">login &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
};

export default SendPwdResetEmail;
