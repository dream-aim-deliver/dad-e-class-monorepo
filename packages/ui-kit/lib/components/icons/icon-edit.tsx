import React from 'react';
import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconGroup
 * @usage <IconGroup />
 */
export const IconEdit = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
        <path d="M19.045 7.40088C19.423 7.02288 19.631 6.52088 19.631 5.98688C19.631 5.45288 19.423 4.95088 19.045 4.57288L17.459 2.98688C17.081 2.60888 16.579 2.40088 16.045 2.40088C15.511 2.40088 15.009 2.60888 14.632 2.98588L4 13.5849V17.9999H8.413L19.045 7.40088ZM16.045 4.40088L17.632 5.98588L16.042 7.56988L14.456 5.98488L16.045 4.40088ZM6 15.9999V14.4149L13.04 7.39688L14.626 8.98288L7.587 15.9999H6ZM4 19.9999H20V21.9999H4V19.9999Z"/>
    </svg>
  );
};
