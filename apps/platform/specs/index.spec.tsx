import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit/contexts';
describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Page />
      </ThemeProvider>,
    );
    expect(baseElement).toBeTruthy();
  });
});
