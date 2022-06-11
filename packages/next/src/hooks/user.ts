import create from 'zustand';
import { persist } from "zustand/middleware"


type State = {
    API_KEY: string,
    API_SECRET: string,
    name: string,
    photoUrl: string
}

const user: any = create(persist(
    (set: any) => ({
        API_KEY: undefined,
        API_SECRET: undefined,
        name: undefined,
        photoUrl: undefined,
        setUser: (
            {
                API_KEY,
                API_SECRET,
                name,
                photoUrl
            }: State
        ) => set((state: State) => ({ ...state, API_KEY, API_SECRET, name, photoUrl })),
    }), {
    name: "user"
}));


const useUser = () => {
    const {
        API_KEY,
        API_SECRET,
        name,
        photoUrl,
        setUser
    } = user();

    return [{
        API_KEY,
        API_SECRET,
        name,
        photoUrl
    }, setUser];
}
export default useUser;
