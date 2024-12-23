import { createRequestHandler } from "@react-router/express";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    VALUE_FROM_VERCEL: string;
  }
}

const app = express();

function getCookies(req: Request) {
  const headerCookies = req.headers.cookie;

  const cookies = headerCookies ? headerCookies.split("; ") : [];

  const cookiesJSON: Record<string, string> = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookiesJSON[key] = value;
  });

  return cookiesJSON;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const cookies = getCookies(req);

  const incomingRoute = req.originalUrl;

  const isAuthorized = cookies["userId"] || false;

  // console.log("authorization status", isAuthorized);

  if (isAuthorized) {
    //don't show the login and signup page
    if (incomingRoute == "/login" || incomingRoute == "/signup") {
      return res.redirect("/home");
    }
  } else {
    //protect the home route
    if (incomingRoute.startsWith("/home")) {
      return res.redirect("/login");
    }
  }

  next();
};

app.use(authMiddleware);

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_VERCEL: "Hello from Vercel",
      };
    },
  })
);

export default app;
