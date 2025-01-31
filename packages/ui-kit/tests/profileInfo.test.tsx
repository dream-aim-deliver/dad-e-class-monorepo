import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { profile } from '@maany_shr/e-class-models';
import { ProfileInfo } from '@/components/profile/profile-info';

describe('ProfileInfo', () => {
  const initialData: profile.TPersonalProfile = {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    dateOfBirth: '1990-01-01',
    profilePicture: '',
    languages: [],
    interfaceLanguage: { code: 'ENG', name: 'English' },
    receiveNewsletter: false,
    isRepresentingCompany: false,
  };

 it('renders with initial data', () => {
    render(<ProfileInfo initialData={initialData} />);
    expect(screen.getByTestId("name")).toHaveValue('John');
    expect(screen.getByTestId("surname")).toHaveValue('Doe');
    expect(screen.getByTestId('email')).toHaveValue('john.doe@example.com');
   expect(screen.getByTestId('phone')).toHaveValue('1234567890');
  });

  it('handles input changes', () => {
    render(<ProfileInfo initialData={initialData} />);
    fireEvent.change(screen.getByTestId("name"), { target: { value: 'Jane' } });
    expect(screen.getByTestId("name")).toHaveValue('Jane');
    fireEvent.change(screen.getByTestId("surname"), { target: { value: 'warner' } });
    expect(screen.getByTestId("surname")).toHaveValue('warner');
    fireEvent.change(screen.getByTestId("email"), { target: { value: 'john.warner@example.com' } });
    expect(screen.getByTestId("email")).toHaveValue('john.warner@example.com');
    fireEvent.change(screen.getByTestId("phone"), { target: { value: '1234567891' } });
    expect(screen.getByTestId("phone")).toHaveValue('1234567891');
  });

  it('handles form submission', () => {
    const onSave = vi.fn();
    render(<ProfileInfo initialData={initialData} onSave={onSave} />);
    fireEvent.click(screen.getByText('Save Changes'));
    expect(onSave).toHaveBeenCalledWith({
      ...initialData,
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01',
      profilePicture: '',
      languages: [],
      interfaceLanguage: { code: 'ENG', name: 'English' },
      receiveNewsletter: false,
      isRepresentingCompany: false,
    });
  });

  it('conditionally renders company fields', () => {
    const companyData = { ...initialData, isRepresentingCompany: true, representingCompanyName: 'Company', representedCompanyUID: 'UID', representedCompanyAddress: 'Address' };
    render(<ProfileInfo initialData={companyData} />);
    expect(screen.getByTestId('companyName')).toBeInTheDocument();
    expect(screen.getByTestId('companyUID')).toBeInTheDocument();
    expect(screen.getByTestId('companyAddress')).toBeInTheDocument();
  });
 });