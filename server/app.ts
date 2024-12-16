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

  const cookiesJson: Record<string, string> = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookiesJson[key] = value;
  });

  return cookiesJson;
}

const middleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("caught you");

  console.log("the incoming request is at", req.originalUrl);

  const cookies = getCookies(req);

  // console.log("the cookies are:", cookies);
  next();
};

app.use(middleware);

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
