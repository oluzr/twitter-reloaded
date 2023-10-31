import { styled } from "styled-components";

export const Wrapper = styled.div`
  @media only screen and (max-width: 600px) {
    padding: 0 10px;
  }
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`;
export const Title = styled.h1`
  font-size: 42px;
  color: #333;
  font-weight: 300;
  padding-top: 2em;
`;
export const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px;
`;
export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  width: 100%;
  font-size: 16px;
  &:not([type="submit"]) {
    border: 1px solid #eee;
  }
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    border: none;
    background-color: tomato;
    color: #fff;
  }
  &[disabled] {
    background-color: #ddd;
    color: #000;
  }
  &.checked {
    background-color: tomato;
    color: #fff;
  }
`;
export const Error = styled.span`
  font-weight: 600;
  color: tomato;
  display: flex;
  margin-top: 20px;
  border: 1px solid tomato;
  width: 100%;
  border-radius: 50px;
  padding: 10px 15px;
  text-align: center;
  align-items: center;
  justify-content: center;
  line-height: 1.4;
`;
export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: tomato;
  }
`;
