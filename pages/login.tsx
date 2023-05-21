import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  const onSubmit = async e => {
    e.preventDefault()
    const user = { email: e.target[0].value, password: e.target[1].value }
    const result = await signIn('credentials', user, { callbackUrl: '/' })
    if(result){
        if (result.error) {
            console.log(result.error)
        }
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}
