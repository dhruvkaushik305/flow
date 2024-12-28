import { NavLink, Outlet } from "react-router";

export default function HomeLayout() {
  return (
    <main className="flex h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}

function Navbar() {
  return (
    <nav className="flex h-[4rem] items-center justify-around border-b border-gray-300">
      <img src="logo.svg" className="w-[8rem]" />
      <div className="space-x-5 text-gray-700">
        {navLinkItems.map((navLink) => (
          <NavLink
            key={navLink.id}
            to={navLink.href}
            className={({ isActive, isPending, isTransitioning }) =>
              [
                // isPending ? "pending" : "",
                isActive ? "navlink-active" : "",
                // isTransitioning ? "transitioning" : "",
              ].join(" ")
            }
          >
            {navLink.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

const navLinkItems = [
  {
    id: "1",
    label: "Home",
    href: "/home",
  },
  {
    id: "2",
    label: "Explore",
    href: "/home/explore",
  },
  {
    id: "3",
    label: "Profile",
    href: "/home/profile",
  },
];
