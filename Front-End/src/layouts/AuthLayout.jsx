import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen ">
      <Outlet />
    </div>
  );
};

export default AuthLayout;

//flex items-center justify-center bg-[var(--color-mainBg)] dark:bg-[var(--color-dark-mainBg)]
