import { describe, it, expect } from 'vitest';
import { hasPermission, AUTH_RULES } from '../src';
import { TAuthUser } from '../src/core/entity/models';


describe('Auth Permission Tests: Profile', () => {
  it('should allow visitor to read profile', () => {
    expect(AUTH_RULES.visitor.profile.read).toBe(true);
  });

  it('should not allow visitor to update profile', () => {
    const visitor: TAuthUser = {
      roles: ['visitor'],
      profile: {
        name: 'Visitor',
        email: 'abcd@gmail.com',
      }
    };

    const canUpdateProfile = hasPermission(visitor, 'profile', 'update', visitor.profile[0]);
    expect(canUpdateProfile).toBe(false);

  });
});
