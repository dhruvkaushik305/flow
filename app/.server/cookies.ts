import { createCookie } from "react-router";

export const userCookie = createCookie("userId", {
  secure: false,
  maxAge: 60 * 60 * 24 * 365 * 1000, // this is 1000 years
});
