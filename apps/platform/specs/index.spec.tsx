import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/[locale]/page';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit/contexts';

const customRender = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>
        {children}
      </ThemeProvider>
    ),
  });
};

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = customRender(<Page />);
    expect(baseElement).toBeTruthy();
  });
});