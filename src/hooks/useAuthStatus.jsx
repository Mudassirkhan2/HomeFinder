import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";


export const useAuthStatus = () => {
    const[login,setLogin] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLogin(true)
            } 
            setCheckingStatus(false)
    })
}, []);
    return {login,checkingStatus}
}

