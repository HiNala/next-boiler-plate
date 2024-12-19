import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ReactElement } from 'react';

// Add providers here as needed
function render(ui: ReactElement, { ...renderOptions } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <>
        {children}
      </>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 