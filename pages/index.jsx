import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Navbar, Nav, Form, FormControl, Button, Carousel, Card, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { BsCartFill, BsPersonFill } from 'react-icons/bs';
import Link from 'next/link';
import CartModal from '../components/CartModal';
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
  const { data: session } = useSession();
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleShowCartModal = () => {
    setShowCartModal(true);
  };

  const handleAddToCart = (product) => {
    const existingCartItem = cartItems.find((item) => item.id === product.id);

    if (existingCartItem) {
      // Se o item já existe no carrinho, atualiza a quantidade e o preço
    const updatedCartItems = cartItems.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1,
            price: item.price,
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      // Se o item não existe no carrinho, adiciona como novo item
      const newCartItem = {
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: 1,
      };
      setCartItems((prevCartItems) => [...prevCartItems, newCartItem]);
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, newCartItem]));
    }
  };

  return (
    <div className="homeContainer">
      <Navbar bg="light" variant="light" className="navbar">
        <Navbar.Brand href="#home" className="brand">Soft Commerce</Navbar.Brand>
        <Form inline className="search-engine">
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-primary" className="searchButton">Search</Button>
        </Form>
        
        <Nav className="ml-auto">
          <Nav.Link onClick={handleShowCartModal}>
            <BsCartFill />
          </Nav.Link>

          {session ? (
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link}>
                <BsPersonFill />
              </Dropdown.Toggle>

              <Dropdown.Menu align="right">
                <Dropdown.Item href="/user">Perfil</Dropdown.Item>
                <Dropdown.Item href="#">Configurações</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => signOut()}>Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav.Link href="/login">Login</Nav.Link>
          )}
        </Nav>
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
          <Row className='line-card'>
            {category.products.map((product) => (
              <Col sm={4} key={product.id} className="productCol">
                <Card className="productCard">
                  <Card.Img variant="top" src={product.imageUrl} className="productImage" />
                  <Card.Body className="card-body">
                    <Link href={`/product/${product.id}`} className='link-card'>
                      <Card.Title className="productTitle">{product.title.length > 30
                                                        ? `${product.title.slice(0, 30)}...`
                                                        : product.title}</Card.Title>
                      <Card.Text className="productDescription">{product.description.length > 25
                                                          ? `${product.description.slice(0, 25)}...`
                                                          : product.description}</Card.Text>
                    </Link>
                    <div className='footer-card'>
                      <Card.Title className="product-price"><b>R${product.price.toFixed(2)}</b></Card.Title>
                      <Button variant='outline-primary' onClick={() => handleAddToCart(product)}>
                        Adicionar <BsCartFill style={{ marginRight: '5px' }} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      ))}

      {showCartModal && (
        <CartModal
          show={showCartModal}
          cartItems={cartItems}
          totalPrice={0}
          onHide={() => setShowCartModal(false)}
        />
      )}
    </div>
  );
};

export default Home;