import { Link } from "react-router";
import { Rocket } from "lucide-react";

export default function RootIndex() {
  return (
    <main className="flex h-screen items-center justify-center bg-background-950">
      <div className="max-w-2xl space-y-6 px-4 md:px-8">
        <header className="space-y-4">
          <img
            src="logo.svg"
            alt="flowy brand logo"
            className="mx-auto w-32 md:w-48"
          />
          <h1 className="text-center text-2xl font-bold md:text-4xl">
            Ride the current of progress
          </h1>
          <h2 className="text-md text-center md:text-lg">
            Supercharge your productivity with a social task tracking app that
            turns goals into a collaborative adventure
          </h2>
        </header>
        <div className="mx-auto flex max-w-[10rem] flex-col items-center space-y-4 md:max-w-full md:flex-row md:justify-between md:space-x-4 md:space-y-0">
          <Link
            to="/login"
            className="text-md flex w-full items-center justify-center gap-3 rounded-lg bg-primary-500 px-3 py-2 text-center text-white md:w-auto md:gap-5 md:px-5 md:py-4"
          >
            Get Started <Rocket className="size-5 md:size-6" />
          </Link>
          <a
            className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-400 px-3 py-2 text-center text-black hover:border-gray-600 md:w-auto md:gap-5 md:px-5 md:py-4"
            href="https://github.com/dhruvkaushik305/flowy"
          >
            Github
            <img
              src="github.svg"
              alt="github logo"
              width="20"
              height="20"
              className="md:h-6 md:w-6"
            />
          </a>
        </div>
      </div>
    </main>
  );
}
