import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função auxiliar para realizar uma requisição com tentativas
async function fetchRetry(url, options, n) {
  for (let i = 0; i < n; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === n - 1) throw err;
      await new Promise((res) => setTimeout(res, 10000));
    }
  }
}

// Esta função é executada no momento da construção
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetchRetry(`${API_URL}/api/products`, {
    headers: {
      'x-api-key': process.env.APP_API_KEY,
    },
  }, 5);
  const products = await response.json();

  // Aqui, você pode especificar os produtos que deseja gerar primeiro
  const paths = products.slice(0, 10).map((product) => ({
    params: { productId: product.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
};

// Esta função é executada no servidor a cada requisição
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.productId) {
    return { notFound: true };
  }

  const response = await fetchRetry(`${API_URL}/api/products/${params.productId}`, {
    headers: {
      'x-api-key': process.env.APP_API_KEY,
    },
  }, 5);

  if (response.status === 404) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const product = await response.json();

  return {
    props: { product },
    revalidate: 10, // Atualiza a página a cada 10 segundos
  };
};

const ProductPage: React.FC<{ product: any }> = ({ product }) => {
  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Detalhes do Produto {product.id}</h1>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>{`R$ ${product.price.toFixed(2)}`}</p>
      <Image src={product.imageUrl} width={500} height={500} alt={product.title} />
    </div>
  );
};

export default ProductPage;
