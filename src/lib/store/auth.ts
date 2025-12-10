import { create } from 'zustand';

interface AuthState {
  isLogged: boolean;
  setIsLogged: (logged: boolean) => void;
  actualUserRol: boolean;
  setActualUserRol: (user: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogged: false,
  setIsLogged: (logged: boolean) => set({ isLogged: logged }),
  actualUserRol: false,
  setActualUserRol: (user: boolean) => set({ actualUserRol: user }),
}));
