import * as React from 'react';
import {Button} from '../button'; // Assuming Button is exported from this file
import { PasswordFieldProps } from './types';

export const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChangeClick }) => {
  const [password, setPassword] = React.useState(value);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); // Update password state
  };

  return (
    <div className="flex flex-col w-full max-md:max-w-full whitespace-nowrap">
      <label className="flex-1 shrink gap-2 self-stretch w-full text-sm leading-none whitespace-nowrap min-h-[22px] text-stone-300 max-md:max-w-full">
        Password
      </label>
      <div className="flex justify-between items-center px-3 py-2 w-full rounded-lg border border-solid bg-stone-950 border-stone-800 min-h-[40px] max-md:max-w-full">
        <input
          type="password"
          value={password}
          onChange={handleInputChange}
          className="flex-1 bg-transparent border-none text-base text-stone-50 focus:outline-none"
        />
        <Button
          variant="text"
          size="small"
          onClick={onChangeClick}
          className="ml-2"
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};
