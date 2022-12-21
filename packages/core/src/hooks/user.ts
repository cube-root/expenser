import create from 'zustand';
import { persist } from 'zustand/middleware';

const user: any = create(
  persist(
    (set:any ) => ({
      setUser: (data: any) =>
        set((state: any) => ({
          ...state,
          ...data,
        })),
    }),
    {
      name: 'user',
      version:1
    },
  ),
);


const useUser = () => {
    const {
        setUser,
        ...rest
    } = user();

    return [{
        ...rest,
    }, setUser];
}

export default useUser;