import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumbs } from '../lib/components/breadcrumbs';

describe('<Breadcrumbs />', () => {
  const mockClickOne = vi.fn();
  const mockClickTwo = vi.fn();
  const mockClickLast = vi.fn();

  beforeEach(() => {
    mockClickOne.mockClear();
    mockClickTwo.mockClear();
    mockClickLast.mockClear();
  });

  const breadcrumbItems = [
    { label: 'Home', onClick: mockClickOne },
    { label: 'Dashboard', onClick: mockClickTwo },
    { label: 'Settings', onClick: mockClickLast },
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumbs items={breadcrumbItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('calls the correct onClick handler when a breadcrumb is clicked', () => {
    render(<Breadcrumbs items={breadcrumbItems} />);

    fireEvent.click(screen.getByText('Home'));
    expect(mockClickOne).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockClickTwo).toHaveBeenCalledTimes(1);
  });

  it('does not make the last breadcrumb clickable', () => {
    render(<Breadcrumbs items={breadcrumbItems} />);

    fireEvent.click(screen.getByText('Settings'));
    expect(mockClickLast).not.toHaveBeenCalled(); // Shouldn't be clickable (span)
  });

  it('renders chevron separators between items (not before the first)', () => {
    render(<Breadcrumbs items={breadcrumbItems} />);

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBe(2);
  });
});
