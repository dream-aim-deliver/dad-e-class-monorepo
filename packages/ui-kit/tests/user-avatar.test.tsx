import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserAvatar } from '../lib/components/avatar/user-avatar';

describe('<UserAvatar />', () => {
  it('renders the avatar with default properties', () => {
    render(<UserAvatar />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('w-12 h-12 text-sm');
    expect(avatar).toHaveTextContent('JF');
  });

  it('renders the avatar with custom size', () => {
    render(<UserAvatar size="large" />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveClass('w-16 h-16 text-sm');
  });

  it('renders initials when hasProfilePicture is false', () => {
    render(<UserAvatar hasProfilePicture={false} initials="AB" />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveTextContent('AB');
    expect(avatar).toHaveClass('bg-base-neutral-700 text-text-secondary font-bold border border-base-neutral-600');
    expect(avatar).not.toContainElement(screen.queryByRole('img'));
  });

  it('renders profile picture when hasProfilePicture is true', () => {
    render(<UserAvatar hasProfilePicture={true} imageUrl="test-image.jpg" />);

    const avatar = screen.getByTestId('user-avatar');
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Profile');
    expect(avatar).not.toHaveTextContent('JF');
  });

  it('applies custom className', () => {
    render(<UserAvatar className="custom-class" />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveClass('custom-class');
  });

  it('renders correct size for xSmall', () => {
    render(<UserAvatar size="xSmall" />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveClass('w-6 h-6 text-2xs'); 
  });

  it('renders correct size for xLarge', () => {
    render(<UserAvatar size="xLarge" />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveClass('w-20 h-20 text-sm');
  });

  it('applies rounded-full class to image', () => {
    render(<UserAvatar hasProfilePicture={true} imageUrl="test-image.jpg" />);

    const img = screen.getByRole('img');
    expect(img).toHaveClass('rounded-full');
  });

  it('uses default initials JF when no initials provided and hasProfilePicture is false', () => {
    render(<UserAvatar hasProfilePicture={false} />);

    const avatar = screen.getByTestId('user-avatar');
    expect(avatar).toHaveTextContent('JF');
  });
});