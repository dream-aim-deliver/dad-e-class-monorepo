import { render, screen,waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { UserAvatar } from '../lib/components/avatar/user-avatar';


describe('UserAvatar Component', () => {
  test('renders initials when imageUrl is missing', () => {
    render(<UserAvatar initials="AB" hasProfilePicture={false} />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveTextContent('AB'); 
  });

  test('renders image when valid imageUrl is provided', () => {
    render(<UserAvatar imageUrl="https://example.com/avatar.jpg" hasProfilePicture={true} />);

    const img = screen.getByRole('img', { name: 'Profile' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('shows initials when image fails to load (without userEvent)',async () => {
    render(<UserAvatar imageUrl="invalid-url.jpg" initials="CD" hasProfilePicture={true} />);
    
    const img = screen.getByRole('img', { name: 'Profile' });

    
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
        expect(screen.getByTestId('user-avatar')).toHaveTextContent('CD');
      });
  });

  test('applies correct size classes', () => {
    render(<UserAvatar initials="XY" size="large" />);
    const avatar = screen.getByTestId('user-avatar');

    // Checking if 'large' size class is applied
    expect(avatar).toHaveClass('w-16 h-16');
  });
});
