import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileTabs } from '../lib/components/profile-tabs';
import { profile } from '@maany_shr/e-class-models';

// Mock Personal Profile Data
const mockPersonalProfile: profile.TPersonalProfile = {
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  dateOfBirth: '1990-01-01',
  profilePicture: 'https://example.com/profile.jpg',
  languages: [
    { code: 'ENG', name: 'English' },
    { code: 'DEU', name: 'German' },
  ],
  interfaceLanguage: { code: 'ENG', name: 'English' },
  receiveNewsletter: true,
  isRepresentingCompany: false,
};

// Mock Professional Profile Data
const mockProfessionalProfile: profile.TProfessionalProfile = {
  bio: 'Experienced software engineer with a passion for building scalable applications.',
  linkedinUrl: 'https://www.linkedin.com/in/johndoe',
  curriculumVitae: 'https://example.com/cv.pdf',
  portfolioWebsite: 'https://johndoe.dev',
  associatedCompanyName: 'Tech Corp',
  associatedCompanyRole: 'Senior Software Engineer',
  associatedCompanyIndustry: 'Technology',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
  isPrivateProfile: false,
};

// Combine both profiles into a single array
const mockProfiles: profile.TProfiles = [
  mockPersonalProfile,
  mockProfessionalProfile,
];

describe('ProfileTabs', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('renders personal profile tab by default', () => {
    render(<ProfileTabs initialProfiles={mockProfiles} locale="en" />);
    expect(screen.getByText(/personal/i)).toBeInTheDocument();
    expect(screen.getByText(/professional/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  it('switches to professional profile tab on click', () => {
    render(<ProfileTabs initialProfiles={mockProfiles} locale="en" />);
    fireEvent.click(screen.getByText(/professional/i));
    expect(
      screen.getByText(/Experienced software engineer/i),
    ).toBeInTheDocument();
  });

  it('renders only the personal profile when no professional profile is provided', () => {
    render(
      <ProfileTabs
        initialProfiles={[mockPersonalProfile]}
        onSave={mockOnSave}
        locale="en"
      />,
    );

    // Check that the personal profile form is rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.queryByText('Bio')).not.toBeInTheDocument();
  });

  it('calls onSave with updated profiles', () => {
    const onSaveMock = vi.fn();
    render(
      <ProfileTabs
        initialProfiles={mockProfiles}
        locale="en"
        onSave={onSaveMock}
      />,
    );

    // Simulate saving personal profile
    fireEvent.click(screen.getByText(/save/i));
    expect(onSaveMock).toHaveBeenCalledWith([
      mockPersonalProfile,
      mockProfessionalProfile,
    ]);

    // Simulate saving professional profile
    fireEvent.click(screen.getByText(/professional/i));
    fireEvent.click(screen.getByText(/save/i));
    expect(onSaveMock).toHaveBeenCalledWith([
      mockPersonalProfile,
      mockProfessionalProfile,
    ]);
  });
});
