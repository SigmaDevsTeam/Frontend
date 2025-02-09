import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  username: string;
  image: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    unsetUser: (state) => {
      state.user = null;
    }
  }
});

export const { setUser, unsetUser } = authSlice.actions;
export default authSlice.reducer;
