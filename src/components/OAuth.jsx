import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const OAuth = () => {
  const { googleLogin } = useAuth()
  const navigate = useNavigate()

  async function handleSuccess(credentialResponse) {
    try {
      await googleLogin(credentialResponse.credential)
      toast.success('Sign in successful')
      navigate('/')
    } catch {
      toast.error('Could not sign in with Google')
    }
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Could not sign in with Google')}
        theme="outline"
        shape="rectangular"
        size="large"
        width="400"
      />
    </div>
  )
}

export default OAuth
