"use client";

import React from "react";

const ErrorPage: React.FC = () => {
  const tryAgain = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <div className="flex h-screen items-center justify-center">
        <h1 className="mb-8 text-4xl  font-bold"> SDA Planckster </h1>
        <h5 className="10s mb-8 animate-pulse text-sm  font-bold">alpha</h5>
        <div className="w-10"></div>
        <div className="mt-8 space-y-4 rounded-md border border-gray-300 p-6 shadow-md">
          <h2 className="text-2xl font-bold">Login</h2>
          <h2>Something went wrong! Please check your credentials.</h2>
          <button
            className="mt-4 w-full rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={tryAgain}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
