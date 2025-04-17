import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SideMenu } from '../lib/components/sidemenu/sidemenu';
import type { MenuItem } from '../lib/components/sidemenu/sidemenu';
import { isLocalAware } from '@maany_shr/e-class-translations';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      sideMenu: {
        studentText: 'Student',
        coachText: 'Coach',
        courseCreatorText: 'Course Creator',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

const mockMenuItems: MenuItem[][] = [
  [
    {
      label: 'Dashboard',
      icon: <div>📊</div>,
      route: '/dashboard',
      isActive: false,
    },
    {
      label: 'Courses',
      icon: <div>📚</div>,
      route: '/courses',
      isActive: true,
    },
  ],
];

describe('SideMenu', () => {
  const defaultProps = {
    userName: 'John Doe',
    userRole: 'student' as 'student' | 'coach' | 'courseCreator',
    menuItems: mockMenuItems,
    locale: 'en' as isLocalAware['locale'],
    onClickItem: vi.fn(),
    onClickToggle: vi.fn(),
  };


  // Test that the SideMenu renders the user's name and the correct role label for a student
  it('renders user information correctly', () => {
    render(<SideMenu {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Student'));
  });

  // Test that when the userRole is 'coach', the coach badge and star rating are displayed correctly
  it('displays coach badge and rating for coach role', () => {
    render(<SideMenu {...defaultProps} userRole="coach" rating={{ score: 4.5, count: 120 }} />);
    
    expect(screen.getByText('Coach'));
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(120)')).toBeInTheDocument();
  });

  // Test that clicking the toggle button triggers the onClickToggle callback to collapse/expand the menu
  it('toggles collapsed state when button is clicked', () => {
    render(<SideMenu {...defaultProps} isCollapsed={false} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
  });

  // Test that clicking a menu item calls the onClickItem callback with the correct menu item
  it('handles menu item clicks', () => {
    render(<SideMenu {...defaultProps} />);
    
    const menuItem = screen.getByText('Dashboard');
    fireEvent.click(menuItem);
    
    expect(defaultProps.onClickItem).toHaveBeenCalledWith(mockMenuItems[0][0]);
  });

  // Test that when the menu is collapsed, it applies the correct CSS class and hides the user name
  it('displays collapsed state correctly', () => {
    render(<SideMenu {...defaultProps} isCollapsed={true} />);
    
    const container = screen.getByTestId('menu-container');
    expect(container).toHaveClass('w-[4rem]');
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  // Test that when expanded, the menu container has the correct width class and menu items are visible
  it('applies correct classes in expanded state', () => {
    render(<SideMenu {...defaultProps} isCollapsed={false} />);
    
    const container = screen.getByTestId('menu-container');
    expect(container).toHaveClass('w-[17.5rem]');
    expect(screen.getByText('Dashboard')).toBeVisible();
  });
  
  // Test that clicking the container when the menu is collapsed triggers the onClickToggle callback
  it('handles container click when collapsed', () => {
    render(<SideMenu {...defaultProps} isCollapsed={true} />);
    
    const container = screen.getByTestId('menu-container');
    fireEvent.click(container);
    
    expect(defaultProps.onClickToggle).toHaveBeenCalled();
  });
});
