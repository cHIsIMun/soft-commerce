import React from 'react';
import { signOut } from 'next-auth/react';
import { Navbar, Nav, Form, FormControl, Button, Carousel, Card, Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getStaticProps() {
  try {
    // Requisição para obter a lista de categorias
    const categoriesResponse = await fetch(`${API_URL}/api/categories/`, {
      headers: {
        'x-api-key': process.env.APP_API_KEY,
      },
    });
    const categoriesData = await categoriesResponse.json();
    const categoryIds = categoriesData.map(category => category.id);

    // Lista de objetos para armazenar as categorias e produtos
    const categoriesWithProducts = [];

    // Iteração sobre cada categoria para buscar os produtos relacionados
    for (const categoryId of categoryIds) {
      // Requisição para obter os detalhes da categoria
      const categoryResponse = await fetch(`${API_URL}/api/categories/${categoryId}`, {
        headers: {
          'x-api-key': process.env.APP_API_KEY,
        },
      });
      const categoryData = await categoryResponse.json();
      
      // Extrair os ids dos produtos relacionados
      const productIds = categoryData.products.map(product => product.productId);

      // Requisição para obter os detalhes dos produtos filtrados pelos ids
      const productsData = [];
      for (const productId of productIds) {
        const productResponse = await fetch(`${API_URL}/api/products/${productId}`, {
          headers: {
            'x-api-key': process.env.APP_API_KEY,
          },
        });
        const productData = await productResponse.json();
        productsData.push(productData);
      }
      
      // Montar o objeto da categoria com os produtos
      const categoryWithProducts = {
        id: categoryData.id,
        name: categoryData.name,
        products: productsData,
      };

      // Adicionar o objeto à lista de categorias e produtos
      categoriesWithProducts.push(categoryWithProducts);
    }
    return {
      props: { categoriesWithProducts },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      props: { categoriesWithProducts: [] },
    };
  }
}


const Home = ({ categoriesWithProducts }) => {
  return (
    <div className="homeContainer">
      <Navbar bg="light" variant="light" className="navbar">
        <Navbar.Brand href="#home" className="brand">Soft Commerce</Navbar.Brand>
        <Form inline className="search-engine">
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-primary" className="searchButton">Search</Button>
        </Form>
        <Nav.Link onClick={() => signOut()} className="navLink">Sair</Nav.Link>
      </Navbar>

      <Carousel className="carousel">
        <Carousel.Item>
          <img
            className="d-block w-100 carouselImage"
            src="https://4.bp.blogspot.com/-FHlfXtScpPk/U12VKaHDJRI/AAAAAAAAZNI/wHnRJTk1_mA/s1600/R.+Groove.jpg"
            alt="Moda masculina"
          />
          <Carousel.Caption className="carouselCaption">
            <h3></h3>
            <p></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carouselImage"
            src="https://cdn.shopify.com/s/files/1/0015/4219/3267/files/Copia_de_BANNER_SITE_CARNAVAL_2507047f-9210-4d83-8892-82e858de032e.png?v=1679321949&width=1600"
            alt="Moda feminina"
          />

          <Carousel.Caption className="carouselCaption">
            <h3></h3>
            <p></p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {categoriesWithProducts.map((category) => (
        <Container key={category.id} className="categoryContainer">
          <h1 className="categoryTitle">{category.name}</h1>
          <Row>
            {category.products.map((product) => (
              <Col sm={4} key={product.id} className="productCol">
                <Card className="productCard">
                  <Card.Img variant="top" src={product.imageUrl} className="productImage" />
                  <Card.Body>
                    <Card.Title className="productTitle">{product.title}</Card.Title>
                    <Card.Text className="productDescription">{product.description.length > 64
                                                            ? `${product.description.slice(0, 64)}...`
                                                            : product.description}</Card.Text>
                    <Link href={`/product/${product.id}`} className="btn btn-primary productButton">
                      Comprar
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      ))}
    </div>
  );
};

export default Home;