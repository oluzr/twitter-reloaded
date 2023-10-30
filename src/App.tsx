import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import CreateAcount from "./routes/create-acount";
import Login from "./routes/login";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./routes/firebase";
import ProtectedRoute from "./components/protected-route";
import SendPwdResetEmail from "./routes/send-pwd-reset-email";
const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    //wait for firebase
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/create-acount",
      element: <CreateAcount />,
    },
    {
      path: "/send-pwd-resetEmail",
      element: <SendPwdResetEmail />,
    },
  ]);
  const GlobalStyles = createGlobalStyle`
  ${reset};
  *{box-sizing:border-box}

  body{
    background-color:#fff;
    color:#222;
    font-family:system-ui;
      /* 아래의 모든 코드는 영역::코드로 사용 */
  ::-webkit-scrollbar {
    width: 6px;  /* 스크롤바의 너비 */ 
  }

  ::-webkit-scrollbar-thumb {
    height: 30%; /* 스크롤바의 길이 */
    background: #1d9bf0; /* 스크롤바의 색상 */
    
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(212, 212, 212, 0.27);  
  }
  }
  `;
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
