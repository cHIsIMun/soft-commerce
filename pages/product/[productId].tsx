import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { productId } = router.query;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:3000/api/products/${productId}`, {
        headers: {
          'x-api-key': process.env.APP_API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => setProduct(data));
    }
  }, [productId]);

  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Detalhes do Produto {productId}</h1>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>{`R$ ${product.price.toFixed(2)}`}</p>
    </div>
  );
};

export default ProductPage;
