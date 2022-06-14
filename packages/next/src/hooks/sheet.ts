import create from 'zustand';
import { persist } from "zustand/middleware"

type State = {
    sheetId: string,
    name: string,
    sheetUrl: string
}
const sheet = create(persist(
    (set: any) => ({
        sheetId: undefined,
        sheetUrl: undefined,
        name: undefined,
        setSheet: (
            {
                sheetId,
                name,
                sheetUrl
            }: State
        ) => set((state: any) => ({ ...state, sheetId, name, sheetUrl })) 
    }),
    {
        name: "sheet"
    }
))


const useSheet:any = () => {
    const { setSheet, name, sheetId, sheetUrl } = sheet();
    return [
        {
            name,
            sheetId,
            sheetUrl
        },
        setSheet
    ]
}

export default useSheet;