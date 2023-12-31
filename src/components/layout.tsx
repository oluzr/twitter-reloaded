import { Link, Outlet, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../routes/firebase";
const Wrapper = styled.div`
  display: grid;
  padding: 50px 0;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  gap: 20px;
  width: 100%;
  max-width: 860px;
  @media only screen and (max-width: 600px) {
    display: block;
    padding: 0;
  }
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media only screen and (max-width: 600px) {
    position: sticky;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: tomato;
    padding: 15px 0;
  }
`;
const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-content: center;
  justify-content: center;
  border: 2px solid gray;
  height: 50px;
  width: 50px;
  padding: 5px;
  border-radius: 50%;
  svg {
    width: 100%;
    fill: gray;
  }
  &.logout {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
  @media only screen and (max-width: 600px) {
    width: 30px;
    height: 30px;
    padding: 0;
    border-color: #fff;
    svg {
      fill: #fff;
      width: 100%;
    }
    &.logout {
      border-color: #fff;
      svg {
        fill: #fff;
      }
    }
  }
`;
const BgIcon = styled.span`
  position: fixed;
  display: none;
  font-size: 15rem;
  z-index: -1;
  top: 4%;
  right: 10%;
  transform: rotate(-10deg);
  opacity: calc(.5);
  &:nth-child(2) {
    font-size: 20rem;
    bottom: 0%;
    top: unset;
    left: 0;
    transform: rotate(20deg) translateX(-110px);
  }
  &:nth-child(3) {
    font-size: 20rem;
    bottom: 2%;
    top: unset;
    right: 30px;
    transform: rotate(-50deg) translateX(-20px);
  }
`;
const Layout = () => {
  const navigate = useNavigate();
  const onLogout = async () => {
    const ok = confirm("are you sure you want to log out?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <BgIcon>🍅</BgIcon>
      <BgIcon>🍅</BgIcon>
      <BgIcon>🥦</BgIcon>
      <Menu>
        <Link to={"/"}>
          <MenuItem>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clipRule="evenodd"
              />
            </svg>
          </MenuItem>
        </Link>
        <Link to={"/profile"}>
          {" "}
          <MenuItem>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          </MenuItem>
        </Link>

        <MenuItem className="logout" onClick={onLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
              clipRule="evenodd"
            />
          </svg>
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
};

export default Layout;
