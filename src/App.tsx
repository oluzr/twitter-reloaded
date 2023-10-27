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
const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`
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
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
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
  ]);
  const GlobalStyles = createGlobalStyle`
  ${reset};
  *{box-sizing:border-box}
  body{
    background-color:#000;
    color:#fff;
    font-family:system-ui
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
