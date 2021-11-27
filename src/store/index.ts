
import { entity } from 'simpler-state';

const initialState = entity({
    userDetails: undefined,
    accessToken: undefined

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
    }
}
export {
    useStore, setStore
}