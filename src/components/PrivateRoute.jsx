import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children, onRedirect }) {
  const { currentUser } = useAuth()
  if (!currentUser) {
    onRedirect('login')
    return null
  }
  return children
}
