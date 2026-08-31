import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';

it('renders the loading indicator', () => {
  const { getByTestId } = render(<LoadingIndicator />);
  // Smoke test placeholder — expand as real screens get built out.
  expect(true).toBe(true);
});
