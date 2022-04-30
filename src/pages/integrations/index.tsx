import { useEffect } from "react";
import { useState } from "react";
import useLocalStorage from "../../hooks/local-storage";
const Integrations = () => {
    const [userData, setData] = useState<any>({})
    const [get] = useLocalStorage();
    const data = get();
    useEffect(() => {
        setData({
            idToken: data.idToken
        });
    }, [
        data
    ])

    return (
        <div>
            <div>
                <div>
                    <button
                        onClick={() => {
                            console.log('in')
                        }}
                    >Show Keys</button>
                </div>
            </div>
        </div>
    )
}

export default Integrations;