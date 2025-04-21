import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SideMenu } from '../lib/components/sidemenu/sidemenu';
import { SideMenuItem } from '../lib/components/sidemenu/sidemenu-item';
import type { MenuItem } from '../lib/components/sidemenu/sidemenu-item';

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
      onClick: vi.fn(),
      isActive: false,
      notificationCount: 3
    },
    {
      label: 'Courses',
      icon: <div>📚</div>,
      onClick: vi.fn(),
      isActive: true,
    },
  ],
];

describe('SideMenu', () => {
  const defaultProps = {
    userName: 'John Doe',
    userRole: 'student' as const,
    locale: 'en' as const,
    onClickToggle: vi.fn(),
    children: mockMenuItems.map((group, i) => (
      <div key={i} className="flex flex-col w-full">
        <div className="h-[1px] bg-divider my-2" />
        {group.map(item => (
          <SideMenuItem
            key={item.label}
            item={item}
            onClickItem={item.onClick}
            isCollapsed={false}
          />
        ))}
      </div>
    ))
  };

  // Render user information
  it('renders user information correctly', () => {
    render(<SideMenu {...defaultProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
  });

  // Render coach badge and rating for coach role
  it('displays coach badge and rating for coach role', () => {
    render(
      <SideMenu 
        {...defaultProps} 
        userRole="coach" 
        rating={{ score: 4.5, count: 120 }} 
      />
    );
    
    expect(screen.getByText('Coach')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(120)')).toBeInTheDocument();
  });

  // Toggle collapsed state when button is clicked
  it('toggles collapsed state when button is clicked', () => {
    render(<SideMenu {...defaultProps} isCollapsed={false} />);
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(defaultProps.onClickToggle).toHaveBeenCalledWith(false);
  });

  // Handle menu item clicks and trigger click handlers
  it('handles menu item clicks', () => {
    render(<SideMenu {...defaultProps} />);
    const menuItem = screen.getByText('Dashboard');
    fireEvent.click(menuItem);
    expect(mockMenuItems[0][0].onClick).toHaveBeenCalled();
  });

  // Display collapsed state correctly
  it('displays collapsed state correctly', () => {
    render(<SideMenu {...defaultProps} isCollapsed={true} />);
    const container = screen.getByTestId('menu-container');
    expect(container).toHaveClass('w-[4rem]');
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  // Display expanded state correctly
  it('applies correct classes in expanded state', () => {
    render(<SideMenu {...defaultProps} isCollapsed={false} />);
    const container = screen.getByTestId('menu-container');
    expect(container).toHaveClass('w-[18rem]');
    expect(screen.getByText('Dashboard')).toBeVisible();
  });
  
  // Toggle collapsed state via icon buttons
  it('triggers toggle via icon buttons', () => {
    const { rerender } = render(<SideMenu {...defaultProps} isCollapsed={true} />);
    
    const container = screen.getByTestId('toggle-container');
    const expandButton = within(container).getByRole('button');
    fireEvent.click(expandButton);
    expect(defaultProps.onClickToggle).toHaveBeenCalledWith(true);

    rerender(<SideMenu {...defaultProps} isCollapsed={false} />);
    const collapseButton = within(container).getByRole('button');
    fireEvent.click(collapseButton);
    expect(defaultProps.onClickToggle).toHaveBeenCalledWith(false);
  });

  // Show course creator badge when applicable
  it('shows course creator badge when applicable', () => {
    render(<SideMenu {...defaultProps} userRole="courseCreator" />);
    expect(screen.getByText('Course Creator')).toBeInTheDocument();
  });

  // Hide rating for student users
  it('hides rating for student users', () => {
    render(<SideMenu {...defaultProps} userRole="student" rating={{ score: 4.5, count: 120 }} />);
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  // Display notification badges correctly
  it('displays notification badges correctly', () => {
    render(<SideMenu {...defaultProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
