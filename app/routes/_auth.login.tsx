import { useActionData } from "react-router";
import { Form, Link } from "react-router";

export async function action({ request }) {}
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
      {actionData?.existingUser && (
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
