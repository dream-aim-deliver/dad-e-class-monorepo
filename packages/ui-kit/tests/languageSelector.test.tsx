import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LanguageSelector } from '@/components/userProfile/languageSelector';

describe('<LanguageSelector />', () => {
  it('renders the language selector component', () => {
    render(<LanguageSelector selectedLanguages={[]} onChange={vi.fn()} />);

    // Check that the dropdown and labels are rendered
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    expect(screen.getByText('Languages Spoken Fluently')).toBeInTheDocument();
    expect(screen.getByText('Interface Language')).toBeInTheDocument();
  });

  it('allows selecting a language', () => {
    const handleChange = vi.fn();
    render(<LanguageSelector selectedLanguages={[]} onChange={handleChange} />);

    const languageSelector = screen.getByTestId('language-selector');

    // Simulate selecting a language
    fireEvent.change(languageSelector, { target: { value: 'Spanish' } });

    // Assert that the onChange handler is called with the new language
    expect(handleChange).toHaveBeenCalledWith([
      { name: 'Spanish', code: 'es' },
    ]);
  });

  it('displays selected languages and allows removing them', () => {
    const handleChange = vi.fn();
    render(
      <LanguageSelector
        selectedLanguages={[{ name: 'English', code: 'en' }]}
        onChange={handleChange}
      />,
    );

    // Scope query to the selected languages container
    const selectedLanguagesContainer = screen.getByTestId('selected-languages');

    // Check that "English" is displayed within this container
    expect(
      within(selectedLanguagesContainer).getByText('English'),
    ).toBeInTheDocument();

    // Query the remove button inside this specific container
    const removeButton = selectedLanguagesContainer.querySelector(
      '#remove-language-container-English button',
    );
    expect(removeButton).toBeInTheDocument();

    // Simulate clicking the remove button
    fireEvent.click(removeButton!);

    // Assert that the onChange handler is called without English
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('allows selecting an interface language', () => {
    render(<LanguageSelector selectedLanguages={[]} onChange={vi.fn()} />);

    const interfaceLanguageSelector = screen.getByTestId(
      'interface-language-selector',
    );

    // Simulate changing the interface language to French
    fireEvent.change(interfaceLanguageSelector, {
      target: { value: 'French' },
    });

    // Assert that the dropdown reflects the new selection
    expect(interfaceLanguageSelector).toHaveValue('French');
  });
});
