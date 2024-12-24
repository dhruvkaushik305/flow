import { data, Form, Link } from "react-router";
import type { Route } from "./+types/_auth.signup";
import { redirect } from "react-router";
import { userCookie } from "~/.server/cookies";
import { checkEmailId, createNewUser } from "~/.server/models/user";
import { formatAuthFormError } from "~/utils/formatAuthFormError";
import { signupSchema } from "~/utils/zodSchema";

type ActionData = Record<string, string> & {
  existingUser?: string;
};

interface SignupComponentProps extends Route.ComponentProps {
  actionData?: ActionData;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const body = {
    name: String(formData.get("name")),
    emailId: String(formData.get("emailId")),
    password: String(formData.get("password")),
  };

  const validateInput = signupSchema.safeParse(body);

  if (!validateInput.success) {
    const issues = formatAuthFormError(validateInput.error.message);

    return data(
      { issues },
      {
        status: 400,
      },
    );
  }

  //check if the email id exists
  const emailExists = await checkEmailId(body.emailId);

  if (emailExists) {
    return data(
      {
        existingUser: true,
      },
      {
        status: 400,
      },
    );
  }

  const newUserId = await createNewUser(body);

  return redirect("/home", {
    headers: { "Set-Cookie": await userCookie.serialize(newUserId) },
  });
}

export default function SignupRoute({ actionData }: SignupComponentProps) {
  return (
    <div>
      <Form method="post" className="flex flex-col gap-5">
        {formFields.map((field, index) => (
          <label key={field.id} className="space-y-1">
            <h2 className="font-medium md:text-lg">{field.labelText}</h2>
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
          Signup
        </button>
        <p className="text-center text-sm">
          or{" "}
          <Link to="/login" className="italic text-blue-500 hover:underline">
            login to an existing account
          </Link>
        </p>
        {actionData?.existingUser ? (
          <p className="form-error">account already exists, login?</p>
        ) : null}
      </Form>
    </div>
  );
}

const formFields = [
  {
    id: 1,
    labelText: "Name",
    inputType: "text",
    inputName: "name",
    inputPlaceholder: "Kody",
  },
  {
    id: 2,
    labelText: "Email",
    inputType: "email",
    inputName: "emailId",
    inputPlaceholder: "kody@remix.run",
  },
  {
    id: 3,
    labelText: "Password",
    inputType: "password",
    inputName: "password",
    inputPlaceholder: "kodylovesyou",
  },
];
