import { useEffect } from "react";
import { useState } from "react"

const UseKeys = () => {
    const [keys, setKeys] = useState({});
    useEffect(() => {
        if (window) {
            const apiKey = window.localStorage.getItem('API_KEY');
            const apiSecret = window.localStorage.getItem('API_SECRET');
            setKeys({
                API_KEY: apiKey,
                API_SECRET: apiSecret
            })
        }
    }, [])
    const set:any = ({ API_KEY, API_SECRET }: { API_KEY: string, API_SECRET: string }) => {
        if (window) {
            window.localStorage.setItem('API_KEY', API_KEY);
            window.localStorage.setItem('API_SECRET', API_SECRET);
        }
    }
    return [keys, set];
}

export default UseKeys