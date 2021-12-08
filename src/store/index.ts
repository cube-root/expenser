
import { Entity, entity } from 'simpler-state';

type InitialState = {
    userDetails: Object | undefined,
    accessToken: String | undefined
    sheetId?: String | undefined
}
const initialState = entity({
    userDetails: undefined,
    accessToken: undefined,
    sheetId: undefined
})


const useStore = () => initialState.use();
const setStore = (data: any) => initialState.set(data);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    setAccessToken: (token: any) => {
        initialState.set(oldValue => ({ ...oldValue, accessToken: token }))
    },
    setUserDetails: (details: any) => {
        initialState.set(oldValue => ({ ...oldValue, userDetails: details }))
    },
    setSheetId: (sheetId: any) => {
        initialState.set(oldValue => ({ ...oldValue, sheetId: sheetId }))
    }
}
export {
    useStore, setStore
}