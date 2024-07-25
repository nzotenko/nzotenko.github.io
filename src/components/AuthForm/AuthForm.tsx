import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useFakeAuth } from "./useFakeAuth";

import "./styles.css";
import clsx from "clsx";

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

type FormValues = {
  email: string;
  password: string;
};

const DEFAULT_FORM_VALUES = {
  email: "",
  password: "",
};

function AuthForm() {
  const { formState, register, handleSubmit } = useForm<FormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [requestError, setRequestError] = useState<string | null>(null);
  const [noValidate, setNoValidate] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const fakeAuth = useFakeAuth();

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    if (formState.isSubmitting)
      if (requestError) {
        setRequestError(null);
      }

    const response = await fakeAuth(data.email, data.password);

    if (response.type === "error") {
      setRequestError(response.message);
    }
  };

  useEffect(() => {
    setNoValidate(true);
  }, []);

  return (
    <form
      action="/auth"
      className={clsx("form", formState.isSubmitted && "submitted")}
      id="sign-in"
      method="POST"
      noValidate={noValidate}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="heading">Sign in</h1>
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <div className="input-wrapper">
          <input
            {...register("email", { required: true, pattern: EMAIL_REGEX })}
            aria-invalid={Boolean(formState.errors.email)}
            autoComplete="username"
            className={clsx("input", formState.errors.email && "has-error")}
            disabled={formState.isSubmitting}
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        {formState.errors.email &&
          formState.errors.email.type === "required" && (
            <output
              className="validation"
              role="alert"
              form="#sign-in"
              name="password"
            >
              <p>Email, please</p>
            </output>
          )}
        {formState.errors.email &&
          formState.errors.email.type === "pattern" && (
            <output
              className="validation"
              role="alert"
              form="#sign-in"
              name="password"
            >
              <p>Valid email, please</p>
            </output>
          )}
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <div className="input-wrapper">
          <input
            {...register("password", { required: true })}
            aria-invalid={Boolean(formState.errors.password)}
            autoComplete="current-password"
            className={clsx("input", formState.errors.email && "has-error")}
            disabled={formState.isSubmitting}
            id="password"
            required
            type={passwordVisible ? "text" : "password"}
          />
          <div className="input-addon">
            <button
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
              onClick={() => setPasswordVisible((visible) => !visible)}
              type="button"
            >
              {passwordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                  <path d="m2 2 20 20" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {formState.errors.password &&
          formState.errors.password.type === "required" && (
            <output
              className="validation"
              role="alert"
              form="#sign-in"
              name="password"
            >
              <p>Password, please</p>
            </output>
          )}
      </div>
      {formState.isSubmitted && requestError && (
        <output className="error" role="alert" form="#sign-in">
          <p>{requestError}</p>
          <button aria-label="Dismiss" onClick={() => setRequestError(null)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </output>
      )}

      <button
        className={clsx("button", formState.isSubmitting && "loading")}
        disabled={formState.isSubmitting}
        type="submit"
      >
        <span className="text">Sign in</span>
        {formState.isSubmitting && <span className="spinner"></span>}
      </button>
    </form>
  );
}

export default AuthForm;
