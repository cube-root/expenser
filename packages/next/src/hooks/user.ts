import create from 'zustand';
import { persist } from "zustand/middleware"


type State = {
    API_KEY: string,
    API_SECRET: string,
    name: string,
    photoUrl: string,
    uid: string,
    accessToken: string,
}

const user: any = create(persist(
    (set: any) => ({
        API_KEY: undefined,
        API_SECRET: undefined,
        name: undefined,
        photoUrl: undefined,
        uid: undefined,
        accessToken: undefined,
        setUser: (
            {
                API_KEY,
                API_SECRET,
                name,
                photoUrl,
                uid,
                accessToken
            }: State
        ) => set((state: State) => ({ ...state, API_KEY, API_SECRET, name, photoUrl, uid, accessToken })),
    }),
    {
        name: "user"
    }
));


const useUser = () => {
    const {
        API_KEY,
        API_SECRET,
        name,
        photoUrl,
        setUser,
        accessToken
    } = user();

    return [{
        API_KEY,
        API_SECRET,
        name,
        photoUrl,
        accessToken
    }, setUser];
}
export default useUser;
