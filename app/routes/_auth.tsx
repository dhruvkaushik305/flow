import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="flex h-screen items-center justify-center p-2">
      <div className="w-[45rem] rounded-md border-2 border-gray-200 bg-primary-950 p-4">
        <header>
          <img
            src="logo-text-black.svg"
            className="mx-auto w-[8rem] md:w-[12rem]"
          />
        </header>
        <Outlet />
      </div>
    </main>
  );
}
