import '../lib/assets/css/index.css';
import { withThemeByClassName } from '@storybook/addon-themes';

export const decorators = [
  withThemeByClassName({
    themes: {
      justDoAdd: 'theme-just-do-add',
      jobRadandMe: 'theme-Job-rand-me',
      Bewerbeagenture: 'theme-Bewerbeagenture',
      CMS: 'theme-Cms',
    },
    defaultTheme: 'justDoAdd',
  }),
];
