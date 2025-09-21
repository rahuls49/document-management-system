import { act } from 'react';
import { useAuthStore } from '../store';

describe('useAuthStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().clearUserData();
    });
  });

  it('should set user data', () => {
    const userData = {
      token: 'test-token',
      user_id: 'test_id',
      user_name: 'Test User',
      roles: [
        { id: 1, role: 'User', role_slug: 'USER', home: 'document-management' }
      ],
      extra: 'extra-info'
    };
    act(() => {
      useAuthStore.getState().setUserData(userData);
    });
    expect(useAuthStore.getState().userData).toEqual(userData);
  });

  it('should clear user data', () => {
    act(() => {
      useAuthStore.getState().setUserData({ token: 'abc', user_id: 'id', user_name: 'name', roles: [] });
      useAuthStore.getState().clearUserData();
    });
    expect(useAuthStore.getState().userData).toBeNull();
  });
});
