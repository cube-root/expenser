import create from 'zustand';
import { persist } from 'zustand/middleware';

const sheets: any = create(
  persist(
    (set: any) => ({
      setSheets: (data: any) =>
        set((state: any) => ({
          ...state,
          ...data,
        })),
    }),
    {
      name: 'sheets',
      version: 1,
    },
  ),
);

const useSheets = () => {
  const { setSheets, ...rest } = sheets();

  return [
    {
      ...rest,
      isSheetConnected: rest && Object.keys(rest).length > 0,
    },
    setSheets,
  ];
};

export default useSheets;
