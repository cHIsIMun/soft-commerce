import { useRouter } from 'next/router';

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { productId } = router.query;

  // Lógica para buscar as informações do produto com base no productId

  return (
    <div>
      <h1>Detalhes do Produto {productId}</h1>
      {/* Renderize as informações do produto aqui */}
    </div>
  );
};

export default ProductPage;
