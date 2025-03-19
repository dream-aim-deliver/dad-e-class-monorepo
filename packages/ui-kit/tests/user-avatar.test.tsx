import { render, screen,waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { UserAvatar } from '../lib/components/avatar/user-avatar';


describe('UserAvatar Component', () => {
  test('renders initials when imageUrl is missing', () => {
    render(<UserAvatar fullName="John Doe" />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveTextContent("JD"); 
  });

  test('renders image when valid imageUrl is provided', () => {
    render(<UserAvatar imageUrl="https://example.com/avatar.jpg"  />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('shows initials when image fails to load (without userEvent)',async () => {
    render(<UserAvatar imageUrl="invalid-url.jpg" fullName="CD"  />);
    
    const img = screen.getByRole('img');

    
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
        expect(screen.getByTestId('user-avatar')).toHaveTextContent('CD');
      });
  });

  test('applies correct size classes', () => {
    render(<UserAvatar fullName="XY" size="large" />);
    const avatar = screen.getByTestId('user-avatar');

    // Checking if 'large' size class is applied
    expect(avatar).toHaveClass('w-16 h-16');
  });
});
