import React from 'react'
import { Outlet ,Navigate} from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'

const PrivateRoute = () => {
    const {login,checkingStatus} = useAuthStatus()
    if(checkingStatus){
        return <h3>Checking Status</h3>
    }
    return login ? <Outlet/> : <Navigate to="/sign-in" /> 
}

export default PrivateRoute
