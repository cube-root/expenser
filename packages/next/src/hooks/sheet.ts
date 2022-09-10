import create from 'zustand';
import { persist } from "zustand/middleware"

type State = {
    sheetId: string,
    name: string,
    sheetUrl: string,
    general: {
        defaultCurrency: string,

    }
}
const sheet = create(persist(
    (set: any) => ({
        sheetId: undefined,
        sheetUrl: undefined,
        name: undefined,
        general: {},
        setSheet: (
            {
                sheetId,
                name,
                sheetUrl,
                general
            }: State
        ) => set((state: any) => ({ ...state, sheetId, name, sheetUrl, general })),
        setCurrency: (currency: string) => set((state: State) => ({
            ...state, general: {
                ...state.general,
                defaultCurrency: currency
            }
        }))
    }),
    {
        name: "sheet"
    }
))


const useSheet: any = () => {
    const { setSheet, setCurrency, name, sheetId, sheetUrl, general } = sheet();

    return [
        {
            name,
            sheetId,
            sheetUrl,
            general,
            setCurrency
        },
        setSheet
    ]
}

export default useSheet;