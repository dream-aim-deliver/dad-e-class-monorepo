import { auth } from '../lib/auth';

describe('auth', () => {
  it('should work', () => {
    expect(auth()).toEqual('auth');
  });
});
