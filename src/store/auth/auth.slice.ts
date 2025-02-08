import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
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
    }
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
