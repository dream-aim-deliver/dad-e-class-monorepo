import '../lib/assets/css/index.css';
import { withThemeByClassName } from '@storybook/addon-themes';

export const decorators = [
  withThemeByClassName({
    themes: {
      orange: 'theme-orange',
      blue: 'theme-blue',
      darkorange: 'theme-dark-orange-shade',
    },
    defaultTheme: 'orange',
  }),
];
