import { NextPage } from "next";
import setStore, { useStore } from '../../store';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import axios from "axios";
import styles from '../../styles/Home.module.css'
import helper from '../../helper';

type InitialState = {
    isLoading: Boolean,
    isCreatingNewSheet: Boolean,
    sheetLink: String | undefined,
    sheetId: String | undefined
}
type ReducerAction = {
    type: String,
    value: any
}
const initialState: InitialState = {
    isLoading: false,
    isCreatingNewSheet: false,
    sheetLink: undefined,
    sheetId: undefined
}
const reducer = (state: InitialState, action: ReducerAction) => {
    switch (action.type) {
        case 'set_loading': {
            return {
                ...state,
                isLoading: action.value
            }
        }
        case 'set_loader_creating': {
            return {
                ...state,
                isCreatingNewSheet: action.value
            }
        }
        case 'set_sheet_url': {
            return {
                ...state,
                sheetLink: action.value
            }
        }
        case 'set_sheet_id': {
            return {
                ...state,
                sheetId: action.value
            }
        }
        default: {
            return state;
        }
    }
}
const ListPage: NextPage = () => {
    const { userDetails = {}, accessToken } = useStore();
    const router = useRouter();
    const [state, dispatch] = useReducer(reducer, initialState);

    // to set loader for creating new sheet
    const setCreateLoader = (value: Boolean) => {
        dispatch({ type: 'set_loader_creating', value })
    }
    // to set sheet url to state
    const setSheetUrl = (value: String) => {
        dispatch({ type: 'set_sheet_url', value })
    }
    // to set sheet id
    const setSheetId = (value: String) => {
        dispatch({ type: 'set_sheet_id', value })
    }
    // create sheet api call
    const createSheet = async () => {
        try {
            setCreateLoader(true);
            const response = await axios.post('/api/sheets/create', {
                accessToken
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(response.data);
        } catch (error) {
            console.log(error)
        }
        finally {
            setCreateLoader(false);
        }
    }
    // for existing sheet
    const continueWithSheet = () => {
        try {
            if(!state.sheetLink){
                throw new Error('Fill the sheet link')
            }
            const sheetId = helper.extractSheet(state.sheetLink);
            setStore.setSheetId(sheetId);
            router.push('/dashboard')
        } catch (error) {
            // TODO invalid sheet id
        }
    }
    useEffect(() => {
        if (!accessToken) {
            router.push('/login')
        }
    }, [accessToken])

    return <div>
        <main className={styles.main}>
            <h1 className={styles.title}>
                Welcome to Expenser
            </h1>
            <button
                className={styles.card}
            >
                <h2>Create new Google sheet &rarr;</h2>
                <p>

                </p>
            </button> <button
                className={styles.card}
            >
                <h2>Add existing Google sheet &rarr;</h2>
                <p className={styles.card}>
                    {/* TODO styling input */}
                    <input
                        type="text"
                        className="p-4 mr-8"
                        placeholder="Google sheet sharable link"
                        onChange={(event) => setSheetUrl(event.target.value)}
                    />
                    <button
                        className={styles.card}
                        onClick={continueWithSheet}
                    >
                        Continue
                    </button>

                </p>
            </button>
        </main>
    </div>
}

export default ListPage;