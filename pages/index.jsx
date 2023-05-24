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
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="#home">Nome da Aplicação</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link onClick={() => signOut()}>Sair</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-primary">Search</Button>
        </Form>
      </Navbar>

      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {categoriesWithProducts.map((category) => (
        <Container key={category.id}>
          <h1>{category.name}</h1>
          <Row>
            {category.products.map((product) => (
              <Col sm={4} key={product.id}>
                <Card>
                  <Card.Img variant="top" src={product.imageUrl} />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Link href={`/product/${product.id}`} className="btn btn-primary">
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
