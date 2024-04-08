import { PropsWithChildren, useReducer } from "react";
import { Logo } from "../components/atoms/logo/logo";
import { UserProfileIcon } from "@/icons/UserProfile";
import { PasswordIcon } from "@/icons/Password";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";
import { Api, cxscoreApiUrl } from "@/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { onChangeAuthToken } from "@/reduxStore/app/app.actions";
import { useNavigate } from "react-router-dom";
import { useLoginRequest } from "../lib/application/use-login";
import { SmallSpinner } from "../components/atoms/loading";
import { BrandType } from "@/types/enum";
import { usePersistedBrandType } from "../lib/application/use-brand-type";

const RoundedTextInputWithIcon = (
  props: PropsWithChildren<
    {
      leftIcon?: React.ReactNode;
      error?: string;
    } & React.InputHTMLAttributes<HTMLInputElement>
  >
) => {
  const { leftIcon, error, ...rest } = props;

  return (
    <div
      className={clsx(
        "relative flex h-10 w-80 rounded-3xl border",
        "border-gray-300",
        error !== "" && "border-red-500"
      )}
    >
      {leftIcon && (
        <div
          role="presentation"
          className={clsx(
            "absolute left-0 flex h-10 items-center rounded-l-3xl  px-2",
            "fill-gray-700 stroke-gray-700",
            error !== "" && "fill-red-700 stroke-red-700"
          )}
        >
          {leftIcon}
        </div>
      )}
      <input
        className="w-full grow rounded-full pl-10 pr-4 placeholder:text-center placeholder:font-display placeholder:text-gray-600"
        {...rest}
      />
    </div>
  );
};

type LoginState = {
  username: string;
  password: string;
  error: string;
};

const LoginInitialState = {
  username: "",
  password: "",
  error: "",
};

const LoginReducer = (state: LoginState, action: any) => {
  switch (action.type) {
    case "username":
      return { ...state, username: action.payload };
    case "password":
      return { ...state, password: action.payload };
    case "error":
      return { ...state, error: action.payload };
    case "reset":
      return { ...LoginInitialState };
    default:
      return state;
  }
};

const useLogin = () => {
  const [state, dispatch] = useReducer(LoginReducer, LoginInitialState);
  const queryClient = useQueryClient();
  const globalDispatch = useDispatch();
  const navigate = useNavigate();
  const { login, isLoading } = useLoginRequest();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.username === "") {
      dispatch({ type: "error", payload: "Username is required" });
    }
    if (state.password === "") {
      dispatch({ type: "error", payload: "Password is required" });
    }
    const token = await login({
      user: state.username,
      password: state.password,
    });

    if (token) {
      globalDispatch(
        onChangeAuthToken({
          token,
        })
      );
      queryClient.resetQueries();
      navigate("/violations");
    } else {
      dispatch({ type: "reset" });
      dispatch({ type: "error", payload: "Invalid username or password" });
    }

    return;
  };

  return {
    state,
    dispatch,
    handleSubmit,
    isLoading,
  };
};

export const LoginPage = () => {
  const { state, dispatch, handleSubmit, isLoading } = useLogin();

  const { brandType } = usePersistedBrandType();

  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div
        className={clsx(
          "flex flex-col items-center justify-center",
          brandType === BrandType.accessbot
            ? "bg-brand-600"
            : "border-b-2 border-blue-600 bg-white md:border-b-0 md:border-r-2"
        )}
      >
        <Logo className="w-48 object-contain md:w-[300px]" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-semibold text-blue-600">Welcome</h1>
        <p className="text-sm text-gray-500">Please login to continue</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center space-y-2"
        >
          <div>
            {state.error !== "" && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
          </div>
          <RoundedTextInputWithIcon
            leftIcon={<UserProfileIcon className="h-6 w-6" />}
            type="text"
            placeholder="Username"
            required
            disabled={isLoading}
            error={state.error}
            value={state.username}
            onChange={(e) => {
              dispatch({ type: "username", payload: e.target.value });
            }}
          />

          <RoundedTextInputWithIcon
            leftIcon={<PasswordIcon className="h-6 w-6" />}
            type="password"
            placeholder="Password"
            required
            disabled={isLoading}
            error={state.error}
            value={state.password}
            onChange={(e) => {
              dispatch({ type: "password", payload: e.target.value });
            }}
          />
          <button
            disabled={isLoading}
            type="submit"
            className="flex w-80 items-center justify-center gap-2 rounded-full bg-blue-500 p-2 text-center font-semibold text-white"
          >
            {isLoading ? (
              <>
                <SmallSpinner className="!mr-0 !ml-0 !text-white" />
                <span>Loading</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </main>
  );
};
