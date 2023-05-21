import { useRouter } from 'next/router';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query;

  // Lógica para buscar os produtos da categoria com base no categoryId

  return (
    <div>
      <h1>Produtos da Categoria {categoryId}</h1>
      {/* Renderize os produtos da categoria aqui */}
    </div>
  );
};

export default CategoryPage;
