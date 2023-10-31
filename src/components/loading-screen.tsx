import { styled } from "styled-components";
const Wrapper = styled.div`
  height:100vh;
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100vw;
`;
const Text = styled.span`
font-size: 7rem;

  
`
const LoadingScreen = () => {
  return (
    <Wrapper>
      <Text>🍅</Text>
    </Wrapper>
  );
};

export default LoadingScreen;
