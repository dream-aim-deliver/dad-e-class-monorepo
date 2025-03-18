import { describe, it, expect } from 'vitest';
import { hasPermission, AUTH_RULES } from '../src';
import { auth, profile } from '@maany_shr/e-class-models';

describe('Auth Permission Tests: Profile', () => {
  it('should allow visitor to read profile', () => {
    expect(AUTH_RULES.visitor.profile.read).toBe(true);
  });

  it('should not allow visitor to update profile', () => {
    const visitor: auth.TSessionUser = {
      roles: ['visitor'],
      name: 'Visitor',
      email: 'abcd@gmail.com',
    };

    const profile: profile.TPersonalProfile = {
      isRepresentingCompany: false,
      email: 'abcd@gmail.com',
      name: 'Visitor',
      surname: 'Visitor',
      phoneNumber: '123456789',
      dateOfBirth: new Date().toISOString(),
      profilePicture: 'https://example.com',
      languages: [{
        name: 'English',
        code: 'ENG',
      }],
      interfaceLanguage: {
        name: 'English',
        code: 'ENG',
      },
      receiveNewsletter: true,
    }
    const canUpdateProfile = hasPermission(visitor, 'profile', 'update', [profile]);
    expect(canUpdateProfile).toBe(false);

  });
});
