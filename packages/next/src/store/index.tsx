

import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = (store:any) => create(store)

const StoreWrapper: any = (Component: any, store: any) => {
    const Wrapper = (props: any) => {
        return (
            <Provider createStore={store}>
                <Component {...props} />
            </Provider>
        )
    };
    return Wrapper
}

export default StoreWrapper;
export {
    useStore,
    createStore,
}

