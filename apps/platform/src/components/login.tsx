'use client';
import React, { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { TLocale } from '@maany_shr/e-class-translations';

interface LoginPageProps {
    platform: string;
    locale: TLocale;
}
const LoginPage = (props: LoginPageProps) => {
  const searchParams = useSearchParams();
  const loggedOut = searchParams?.get('loggedout');

  const handleSubmit = async (inputValues: {
    userName: string;
    userPassword: string;
  }): Promise<void> => {
    await signIn('credentials', {
      username: inputValues.userName,
      password: inputValues.userPassword,
      callbackUrl: '/',
    });
  };

  return (
    <div className="flex text-white w-full items-center justify-center ">
      <div className="flex flex-col items-center justify-between text-center gap-4">
        <h1 className="mb-8 text-4xl font-bold animate-pulseGrow"> {props.platform} </h1>
        <div className="text-left space-y-4 animate-fade-in transform rounded-md border border-gray-300 p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
          {loggedOut && (
            <div className="mb-4 rounded bg-green-500 p-4 text-white">
              Successfully logged out.
            </div>
          )}
          <h2 className="mb-4 text-2xl font-bold">Login</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const inputValues = {
                userName: formData.get('username') as string,
                userPassword: formData.get('password') as string,
              };
              await handleSubmit(inputValues);
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-500"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-500"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </div>
          </form>
          <button
            onClick={() => signIn('auth0', { callbackUrl: '/' })}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In with Auth0
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginPageWithSuspense = (props: LoginPageProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage {...props}/>
    </Suspense>
  );
};

export default LoginPageWithSuspense;
