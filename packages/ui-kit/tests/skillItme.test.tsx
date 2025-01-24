import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillItem } from '@/components/professionalCard/skillItem';

describe('<SkillItem />', () => {
  it('renders skill name correctly', () => {
    render(<SkillItem name="React" onRemove={vi.fn()} />);
    const skillName = screen.getByText('React');

    expect(skillName).toBeInTheDocument();
  });

  it('renders remove button', () => {
    const { container } = render(<SkillItem name="React" onRemove={vi.fn()} />);
    const removeButton = container.querySelector(
      '#remove-button-container button',
    );

    expect(removeButton).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn();
    const { container } = render(
      <SkillItem name="React" onRemove={handleRemove} />,
    );
    const removeButton = container.querySelector(
      '#remove-button-container button',
    );

    if (removeButton) fireEvent.click(removeButton);

    expect(handleRemove).toHaveBeenCalledWith('React');
  });
});
