import '../lib/assets/css/index.css';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../../ui-kit/lib/assets/css/index.css';

export const decorators = [
  withThemeByClassName({
    themes: {
      justDoAdd: 'theme-just-do-add',
      jobBrandandMe: 'theme-job-brand-and-me',
      Bewerbeagentur: 'theme-bewerbeagentur',
      CMS: 'theme-cms',
    },
    defaultTheme: 'justDoAdd',
  }),
];
