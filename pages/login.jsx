import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function LoginPage() {
  const router = useRouter()

  const onSubmit = async e => {
    e.preventDefault()
    await signIn('credentials', { email: e.target[0].value, password: e.target[1].value }).then(() => {
      router.push('/')
    })
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

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
