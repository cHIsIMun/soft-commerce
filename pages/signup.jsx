import { useState } from "react";
import { signIn, getSession } from "next-auth/react"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'next/link'
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/signup`, {
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
    <div className="container">
      <h2 className="subtitle"><b>SignUp</b></h2>
      <h1 className="title">Bem vindo ao Soft Commerce</h1>
      <p className="info-text">Por favor, preencha os detalhes abaixo para se registrar:</p>
        <Form onSubmit={handleSubmit} className="form">
          <Form.Label htmlFor="inputName5" className="form-label">Digite seu nome de usuário: </Form.Label>
          <Form.Control
            type="text"
            id="inputName5"
            onChange={e => setName(e.target.value)}
            value={name}
            placeholder="Digite seu nome"
            className="form-control"
          />
          <Form.Label htmlFor="inputEmail5" className="form-label">Digite seu email:</Form.Label>
          <Form.Control
            type="email"
            id="inputEmail5"
            onChange={e => setEmail(e.target.value)}
            value={email}
            placeholder="Digite seu email"
            className="form-control"
          />
          <Form.Label htmlFor="inputName5" className="form-label">Digite sua senha:</Form.Label>
          <Form.Control
            type="password"
            id="inputPass5"
            onChange={e => setPassword(e.target.value)}
            value={password}
            placeholder="Digite sua senha"
            className="form-control"
          />
        <Button type="submit" variant="outline-primary" className="btn-submit">Cadastrar</Button>
      </Form>
      {error && <p className="error-message">{error}</p>}
      <p className="login-link">Já tem uma conta? <Link href="/login">Acesse aqui</Link></p>
    </div>
  );
};

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

export default SignUp;
