import { render, screen } from '@testing-library/react';
import { UserAvatarReel } from '../lib/components/avatar/user-avatar-reel';
import { UserAvatar } from '../lib/components/avatar/user-avatar';

describe('UserAvatarReel Component', () => {
  // Mock avatars data
  const mockAvatars = (
    <>
      <UserAvatar 
        fullName="Alice Smith" 
        imageUrl="https://example.com/alice.jpg" 
        className="mr-[-12px]"
      />
      <UserAvatar 
        fullName="Bob Johnson" 
        imageUrl="https://example.com/bob.jpg" 
        className="mr-[-12px]"
      />
      <UserAvatar 
        fullName="Charlie Brown" 
        imageUrl="https://example.com/charlie.jpg" 
        className="mr-[-12px]"
      />
      <UserAvatar 
        fullName="+3" 
        className="mr-[-12px]"
      />
    </>
  );

  it('renders multiple avatars', () => {
    render(<UserAvatarReel>{mockAvatars}</UserAvatarReel>);
    
    const avatarContainer = screen.getByRole('group');
    expect(avatarContainer).toBeInTheDocument();
    
    const avatars = screen.getAllByTestId('user-avatar');
    expect(avatars.length).toBe(4);
  });

  it('renders single avatar correctly', () => {
    render(
      <UserAvatarReel>
        <UserAvatar fullName="Solo User" />
      </UserAvatarReel>
    );
    
    const avatars = screen.getAllByTestId('user-avatar');
    expect(avatars.length).toBe(1);
    expect(avatars[0]).toHaveTextContent('SU');
  });

  it('applies custom className correctly', () => {
    render(
      <UserAvatarReel className="custom-class">
        {mockAvatars}
      </UserAvatarReel>
    );
    
    expect(screen.getByRole('group')).toHaveClass('custom-class');
  });

  it('renders mixed avatar types (image + initials)', () => {
    const mixedAvatars = (
      <>
        <UserAvatar fullName="AA" imageUrl="https://example.com/aa.jpg" />
        <UserAvatar fullName="BB" />
        <UserAvatar fullName="CC" imageUrl="https://example.com/cc.jpg" />
      </>
    );
    
    render(<UserAvatarReel>{mixedAvatars}</UserAvatarReel>);
    
    const images = screen.getAllByRole('img');
    const initials = screen.getAllByText('BB');
    
    expect(images.length).toBe(2);
    expect(initials.length).toBe(1);
  });

  it('renders overflow indicator correctly', () => {
    render(<UserAvatarReel>{mockAvatars}</UserAvatarReel>);
    
    const overflowAvatar = screen.getByText('+3');
    expect(overflowAvatar).toBeInTheDocument();
    expect(overflowAvatar.closest('div')).toHaveClass('bg-base-neutral-700');
  });
});
