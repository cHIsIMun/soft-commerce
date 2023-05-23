import { useRouter } from 'next/router';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query;

  return (
    <div>
      <h1>Produtos da Categoria {categoryId}</h1>
    </div>
  );
};

export default CategoryPage;
