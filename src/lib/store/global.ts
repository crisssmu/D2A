

import { create } from 'zustand';

export type GlobalState = {
    loader: boolean;
    setLoader: (loader: boolean) => void;
}


export const useGlobalStore = create<GlobalState>((set) => ({
  loader: false,
  setLoader: (loader: boolean) => set({ loader: loader })
}));



