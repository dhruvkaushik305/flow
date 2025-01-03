import { redirect } from "react-router";
import { data, useActionData } from "react-router";
import type { Route } from "./+types/_auth.login";
import { Form, Link } from "react-router";
import invariant from "tiny-invariant";
import { userCookie } from "~/.server/cookies";
import { checkEmail, checkPassword, fetchUserId } from "~/.server/models/user";
import { formatAuthFormError } from "~/utils/formatAuthFormError";
import { loginSchema } from "~/utils/zodSchema";

type ActionData = Record<string, string> & {
  userNotFound?: string;
};

interface LoginComponentProps extends Route.ComponentProps {
  actionData?: ActionData;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const body = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };

  const validateInput = loginSchema.safeParse(body);

  if (!validateInput.success) {
    const issues = formatAuthFormError(validateInput.error.message);

    return data(issues, {
      status: 400,
    });
  }

  //check if the email does not exists
  const emailExists = await checkEmail(body.email);

  if (!emailExists) {
    return data(
      {
        userNotFound: true,
      },
      {
        status: 400,
      },
    );
  }

  //check for password
  const passwordCorrect = await checkPassword(body.email, body.password);

  if (!passwordCorrect) {
    return data(
      {
        userNotFound: true,
      },
      {
        status: 400,
      },
    );
  }

  //fetch userId
  const userId = await fetchUserId(body.email);

  invariant(userId, "Database did not return userId");

  return redirect("/home", {
    headers: { "Set-Cookie": await userCookie.serialize(userId) },
  });
}

export default function LoginRoute({ actionData }: LoginComponentProps) {
  return (
    <Form method="post" className="flex flex-col gap-5">
      {formFields.map((field) => (
        <label key={field.id} className="form-label">
          <h2 className="form-label-text">
            {field.inputName.charAt(0).toUpperCase() + field.inputName.slice(1)}
            {/* converts the name to Title Case */}
          </h2>
          <input
            type={field.inputType}
            name={field.inputName}
            placeholder={field.inputPlaceholder}
            className="input-box"
          />
          {actionData ? (
            <p className="form-error">{actionData[field.inputName]}</p>
          ) : null}
        </label>
      ))}
      <button type="submit" className="btn-accent">
        Login
      </button>
      <p className="text-center text-sm">
        or{" "}
        <Link to="/signup" className="italic text-blue-500 hover:underline">
          create an account
        </Link>
      </p>
      {actionData?.userNotFound ? (
        <p className="form-error">
          Email or password incorrect, please try again
        </p>
      ) : null}
    </Form>
  );
}

const formFields = [
  {
    id: 1,
    inputType: "text",
    inputName: "email",
    inputPlaceholder: "kody@remix.run",
  },
  {
    id: 2,
    inputType: "password",
    inputName: "password",
    inputPlaceholder: "kodylovesyou",
  },
];
