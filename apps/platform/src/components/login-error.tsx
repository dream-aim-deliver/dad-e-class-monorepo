"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import React from "react";
import { Button } from '@maany_shr/e-class-ui-kit';

interface ErrorPageProps {
    platform: string;
    locale: TLocale;
}

const ErrorPage = (props: ErrorPageProps) => {
  const tryAgain = () => {
    window.location.href = "/";
  };

  return (
    <div className="theme-Cms flex items-center justify-center text-neutral-50">
      <div className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl font-bold">{props.platform}</h1>
        <div className="space-y-4 rounded-md border border-base-neutral-700 bg-card-fill p-6 shadow-md">
          <h2>Oops! There was a problem signing you in.</h2>
          <p className="text-lg text-neutral-300">Please check your username and password and try again.</p>
          <Button
            variant="primary"
            size="medium"
            text={('Try Again')}
            onClick={tryAgain}
            className="mx-auto"
          >
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
