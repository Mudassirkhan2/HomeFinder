import React from 'react'
import { Outlet ,Navigate} from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
    const {login,checkingStatus} = useAuthStatus()
    if(checkingStatus){
        return <Spinner/>
    }
    return login ? <Outlet/> : <Navigate to="/sign-in" /> 
}

export default PrivateRoute
