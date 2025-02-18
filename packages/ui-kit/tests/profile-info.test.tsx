import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileInfo } from '../lib/components/profile/profile-info';
import { profile } from '@maany_shr/e-class-models';

describe('<ProfileInfo />', () => {
  const mockOnSave = vi.fn();
  const initialData: profile.TPersonalProfile = {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    dateOfBirth: '1990-01-01',
    profilePicture: '',
    languages: [],
    interfaceLanguage: { code: 'ENG', name: 'English' },
    receiveNewsletter: true,
    isRepresentingCompany: false,
  };

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('renders the component with initial data', () => {
    render(
      <ProfileInfo initialData={initialData} onSave={mockOnSave} locale="en" />,
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/surname/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('1234567890');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
  });

  it('updates form fields correctly', () => {
    render(
      <ProfileInfo initialData={initialData} onSave={mockOnSave} locale="en" />,
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane' } });
    expect(nameInput).toHaveValue('Jane');

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
    expect(emailInput).toHaveValue('jane.doe@example.com');
  });

  it('handles file uploads', () => {
    render(
      <ProfileInfo initialData={initialData} onSave={mockOnSave} locale="en" />,
    );

    const file = new File(['image'], 'profile.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByTestId('file-upload-input'); // Assuming a test ID is set for the file input
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('profile.jpg')).toBeInTheDocument(); // Assuming the file name is displayed
  });

  it('handles checkbox toggles', () => {
    render(
      <ProfileInfo initialData={initialData} onSave={mockOnSave} locale="en" />,
    );

    const newsletterCheckbox = screen.getByLabelText(/newsletter/i);
    fireEvent.click(newsletterCheckbox);
    expect(newsletterCheckbox).not.toBeChecked();
  });

  it('handles representing company fields visibility toggle', () => {
    render(
      <ProfileInfo initialData={initialData} onSave={mockOnSave} locale="en" />,
    );

    const representingCompanyCheckbox =
      screen.getByLabelText(/representing company/i);
    fireEvent.click(representingCompanyCheckbox);

    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
  });

  it('resets form fields when "Discard" button is clicked', () => {
    render(
      <ProfileInfo initialData={initialData} onSave={mockOnSave} locale="en" />,
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane' } });

    const discardButton = screen.getByText(/discard changes/i); // Assuming the button text is "Discard Changes"
    fireEvent.click(discardButton);

    expect(nameInput).toHaveValue('John'); // Resets to initial data
  });

  it('submits the form with updated data', () => {
    render(
      <ProfileInfo initialData={initialData} onSave={mockOnSave} locale="en" />,
    );

    // Update the name field
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane' } });

    // Update the surname field
    const surnameInput = screen.getByLabelText(/surname/i);
    fireEvent.change(surnameInput, { target: { value: 'Smith' } });

    // Update the email field
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, {
      target: { value: 'jane.smith@example.com' },
    });

    // Update the phone number field
    const phoneNumberInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneNumberInput, { target: { value: '9876543210' } });

    // Update the date of birth field
    const dateOfBirthInput = screen.getByLabelText(/date of birth/i);
    fireEvent.change(dateOfBirthInput, { target: { value: '1995-05-15' } });

    // Toggle the newsletter checkbox
    const newsletterCheckbox = screen.getByLabelText(/newsletter/i);
    fireEvent.click(newsletterCheckbox);

    // Toggle the "representing company" checkbox and fill company details
    const representingCompanyCheckbox =
      screen.getByLabelText(/representing company/i);
    fireEvent.click(representingCompanyCheckbox);

    const companyNameInput = screen.getByLabelText(/company name/i);
    fireEvent.change(companyNameInput, { target: { value: 'Tech Corp' } });

    const companyUIDInput = screen.getByLabelText(/company UID/i);
    fireEvent.change(companyUIDInput, { target: { value: '123456789' } });

    const companyAddressInput = screen.getByLabelText(/address/i);
    fireEvent.change(companyAddressInput, {
      target: { value: '123 Tech Street' },
    });

    // Submit the form
    const saveButton = screen.getByText(/save changes/i); // Assuming the button text is "Save Changes"
    fireEvent.click(saveButton);

    // Assert that onSave was called with updated data
    expect(mockOnSave).toHaveBeenCalledWith({
      ...initialData,
      name: 'Jane',
      surname: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '9876543210',
      dateOfBirth: '1995-05-15',
      receiveNewsletter: false, // Newsletter checkbox was toggled off
      isRepresentingCompany: true, // Representing company checkbox was toggled on
      representingCompanyName: 'Tech Corp',
      representedCompanyUID: '123456789',
      representedCompanyAddress: '123 Tech Street',
      profilePicture: '',
      languages: [],
      interfaceLanguage: { code: 'ENG', name: 'English' },
    });
  });
});
