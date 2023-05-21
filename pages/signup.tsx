import { useState, useEffect } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])
  
  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (res.status !== 201) {
        setError("Algo deu errado ao criar sua conta. Tente novamente.");
      } else {
        signIn("credentials", { email, password, callbackUrl: "/" });
      }
    } catch (err) {
      setError("Algo deu errado ao criar sua conta. Tente novamente.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default SignUp;
