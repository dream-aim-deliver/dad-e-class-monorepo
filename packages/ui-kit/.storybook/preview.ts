import '../lib/assets/css/index.css';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../../ui-kit/lib/assets/css/index.css';

export const decorators = [
  withThemeByClassName({
    themes: {
      justDoAdd: 'theme-just-do-add',
      jobRadandMe: 'theme-Job-rand-me',
      Bewerbeagentur: 'theme-Bewerbeagentur',
      CMS: 'theme-Cms',
    },
    defaultTheme: 'justDoAdd',
  }),
];
