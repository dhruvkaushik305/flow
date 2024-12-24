import { redirect } from "react-router";
import { data, useActionData } from "react-router";
import { Form, Link } from "react-router";
import invariant from "tiny-invariant";
import { userCookie } from "~/.server/cookies";
import {
  checkEmailId,
  checkPassword,
  fetchUserId,
} from "~/.server/models/user";
import { formatAuthFormError } from "~/utils/formatAuthFormError";
import { loginSchema } from "~/utils/zodSchema";

export async function action({ request }) {
  const formData = await request.formData();

  const body = {
    emailId: String(formData.get("emailId")),
    password: String(formData.get("password")),
  };

  const validateInput = loginSchema.safeParse(body);

  if (!validateInput.success) {
    const issues = formatAuthFormError(validateInput.error.message);

    return data(issues, {
      status: 400,
    });
  }

  //check if the email id does not exists
  const emailExists = await checkEmailId(body.emailId);

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
  const passwordCorrect = await checkPassword(body.emailId, body.password);

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
  const userId = await fetchUserId(body.emailId);

  invariant(userId, "Database did not return userId");

  return redirect("/home", {
    headers: { "Set-Cookie": await userCookie.serialize(userId) },
  });
}
export default function LoginRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="flex flex-col gap-5">
      {formFields.map((field) => (
        <label key={field.id} className="space-y-1">
          <h2 className="font-medium md:text-lg">{field.labelText}</h2>
          <input
            type={field.inputType}
            name={field.inputName}
            placeholder={field.inputPlaceholder}
            className="input-box"
          />
          <p className="form-error">
            {actionData && actionData[field.inputName]}
          </p>
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
      {actionData?.userNotFound && (
        <p>Email or password incorrect, please try again</p>
      )}
    </Form>
  );
}

const formFields = [
  {
    id: 1,
    labelText: "Email",
    inputType: "text",
    inputName: "emailId",
    inputPlaceholder: "kody@remix.run",
  },
  {
    id: 2,
    labelText: "Password",
    inputType: "password",
    inputName: "password",
    inputPlaceholder: "kodylovesyou",
  },
];
