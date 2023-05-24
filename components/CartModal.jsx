import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const CartModal = ({ onHide }) => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Carrinho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cartItems.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>R${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>R${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <p>Total: R${totalPrice.toFixed(2)}</p>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        {/* Adicione aqui a lógica para realizar o checkout ou outras ações */}
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
