"use client";

import { login, registerUser } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormInputs>();
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (data: FormInputs) => {
    setErrorMessage("");
    const { name, email, password } = data;
    const res = await registerUser(name, email, password);
    if (!res.ok) {
      setErrorMessage(res.message);
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace("/");
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col"
    >
      {/* {
            errors.name?.type === 'required' && (
                <span className=" text-red-500 text-sm">* EL nombre es obligatorio</span>
            )

        } */}
      <label htmlFor="fullName">Nombre completo</label>
      <input
        autoFocus
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": !!errors.name,
        })}
        type="text"
        {...register("name", { required: true })}
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": !!errors.email,
        })}
        type="email"
        {...register("email", {
          required: true,
          pattern:
            /^(?![_.-])([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        })}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": !!errors.name,
        })}
        type="password"
        {...register("password", { required: true, minLength: 6 })}
      />

      <span className=" text-red-500 text-sm">{errorMessage}</span>

      <button className="btn-primary">Crear cuenta</button>

      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
