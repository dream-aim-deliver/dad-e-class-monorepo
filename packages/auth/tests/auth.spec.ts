import { auth } from '../src/lib/auth';

describe('auth', () => {
  it('should work', () => {
    expect(auth()).toEqual('auth');
  });
});
