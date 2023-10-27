import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../routes/firebase";
import { useNavigate } from "react-router-dom";
const Button = styled.span`
  background-color: #fff;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  color: #000;
  margin-top: 50px;
  width: 100%;
`;
const Logo = styled.img`
  height: 25px;
`;
const GithubButton = () => {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
};

export default GithubButton;
