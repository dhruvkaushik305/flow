import { data, Form } from "react-router";
// import type { Route } from "./+types/_auth.signup";
import { useActionData } from "react-router";
import { redirect } from "react-router";
import { userCookie } from "~/.server/cookies";
import { createNewUser, verifyEmailId } from "~/.server/models/user";
import { signupSchema } from "~/utils/zodSchema";

export async function action({ request }) {
  const formData = await request.formData();

  const body = {
    name: String(formData.get("name")),
    emailId: String(formData.get("emailId")),
    password: String(formData.get("password")),
  };

  const validateInput = signupSchema.safeParse(body);

  if (!validateInput.success) {
    const errorDetails = JSON.parse(validateInput.error.message);

    const issues = {};

    errorDetails.forEach((errorDetail) => {
      issues[errorDetail.path[0]] = errorDetail.message;
    });

    return data(issues, {
      status: 400,
    });
  }

  //check if the email id exists
  const checkEmailId = await verifyEmailId(body.emailId);

  if (!checkEmailId) {
    //this email is not safe, failed the email check
    return data(
      {
        existingUser: true,
      },
      {
        status: 400,
      }
    );
  }

  const newUserId = await createNewUser(body);

  return redirect("/home", {
    headers: { "Set-Cookie": await userCookie.serialize(newUserId) },
  });
}

export default function SignupRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Form method="post" className="flex flex-col gap-5">
        {formFields.map((field, index) => (
          <label key={field.id} className="flex flex-col gap-1">
            <h2 className="font-medium">{field.labelText}</h2>
            <input
              type={field.inputType}
              name={field.inputName}
              placeholder={field.inputPlaceholder}
              className="rounded-lg border-2 border-zinc-300 p-2 focus:border-zinc-500 focus:outline-none"
            />
            <p>{actionData && actionData[field.inputName]}</p>
          </label>
        ))}
        <button
          type="submit"
          className="rounded-md bg-accent-700 px-4 py-3 font-medium"
        >
          Signup
        </button>
        {actionData?.existingUser && (
          <p>A user with this email already exists!</p>
        )}
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
    inputPlaceholder: "Password",
  },
];
