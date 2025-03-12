import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { ref, get, remove, update, set, push } from "firebase/database";
import styled from "styled-components";

// Main container styles
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  font-size: 1.75rem;
  color: #2a3f54;
  margin: 0;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || "#4ecdc4"};
`;

const StatTitle = styled.h4`
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 600;
  color: #2a3f54;
`;

// Form styles
const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  color: #2a3f54;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
  }
`;

const Button = styled.button`
  background-color: ${props => props.variant === "primary" ? "#4ecdc4" : props.variant === "danger" ? "#f44336" : 
                              props.variant === "warning" ? "#ff9800" : 
                              props.variant === "success" ? "#4caf50" : "#e9ecef"};
  color: ${props => props.variant === "primary" || props.variant === "danger" || 
                  props.variant === "warning" || props.variant === "success" ? "white" : "#495057"};
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${props => props.variant === "primary" ? "#3dbeb6" : props.variant === "danger" ? "#e53935" : 
                                props.variant === "warning" ? "#fb8c00" : 
                                props.variant === "success" ? "#43a047" : "#dee2e6"};
  }
`;

const SubmitButton = styled(Button)`
  grid-column: 1 / -1;
  margin-top: 0.5rem;
`;

// Table styles
const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.875rem;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.875rem;
  color: #495057;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e9ecef;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.status ? "#e8f5e9" : "#ffebee"};
  color: ${props => props.status ? "#43a047" : "#e53935"};
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    availability: true,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await get(ref(db, "products"));
      if (snapshot.exists()) {
        setProducts(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = (id) => {
    remove(ref(db, `products/${id}`));
    setProducts(products.filter((product) => product.id !== id));
  };

  const toggleAvailability = (id, status) => {
    update(ref(db, `products/${id}`), { availability: !status });
    setProducts(products.map((product) => (product.id === id ? { ...product, availability: !status } : product)));
  };

  const addProduct = (e) => {
    e.preventDefault();
    const newProductRef = push(ref(db, "products"));
    set(newProductRef, {
      ...newProduct,
      price: Number(newProduct.price),
    }).then(() => {
      setProducts([...products, { id: newProductRef.key, ...newProduct }]);
      setNewProduct({ name: "", price: "", category: "", image: "", availability: true });
    }).catch((error) => console.error("Error adding product:", error));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const saveEdit = () => {
    update(ref(db, `products/${editingProduct.id}`), {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      category: editingProduct.category,
      image: editingProduct.image,
    }).then(() => {
      setProducts(products.map((product) => (product.id === editingProduct.id ? editingProduct : product)));
      setEditingProduct(null);
    }).catch((error) => console.error("Error updating product:", error));
  };

  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(product => product.availability).length;
  const outOfStockProducts = totalProducts - inStockProducts;

  return (
    <DashboardContainer>
      <DashboardHeader>
        <PageTitle>Product Management</PageTitle>
      </DashboardHeader>

      <Stats>
        <StatCard color="#4ecdc4">
          <StatTitle>Total Products</StatTitle>
          <StatValue>{totalProducts}</StatValue>
        </StatCard>
        <StatCard color="#4caf50">
          <StatTitle>In Stock</StatTitle>
          <StatValue>{inStockProducts}</StatValue>
        </StatCard>
        <StatCard color="#f44336">
          <StatTitle>Out of Stock</StatTitle>
          <StatValue>{outOfStockProducts}</StatValue>
        </StatCard>
      </Stats>

      {/* Product Addition Form */}
      <FormContainer>
        <FormTitle>Add New Product</FormTitle>
        <Form onSubmit={addProduct}>
          <FormField>
            <InputLabel>Product Name</InputLabel>
            <Input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </FormField>
          <FormField>
            <InputLabel>Price</InputLabel>
            <Input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
          </FormField>
          <FormField>
            <InputLabel>Category</InputLabel>
            <Input
              type="text"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              required
            />
          </FormField>
          <FormField>
            <InputLabel>Image URL</InputLabel>
            <Input
              type="url"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              required
            />
          </FormField>
          <SubmitButton type="submit" variant="primary">Add Product</SubmitButton>
        </Form>
      </FormContainer>

      {/* Product Table */}
      <TableContainer>
        <FormTitle>Product Inventory</FormTitle>
        <ProductTable>
          <thead>
            <tr>
              <TableHeader>Image</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Availability</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <ProductImage src={product.image} alt={product.name} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <StatusBadge status={product.availability}>
                    {product.availability ? "In Stock" : "Out of Stock"}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Button 
                      variant={product.availability ? "warning" : "success"}
                      onClick={() => toggleAvailability(product.id, product.availability)}
                    >
                      {product.availability ? "Mark Out" : "Mark In"}
                    </Button>
                    <Button onClick={() => handleEdit(product)}>Edit</Button>
                    <Button variant="danger" onClick={() => deleteProduct(product.id)}>Delete</Button>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </ProductTable>
      </TableContainer>

      {/* Edit Product Modal */}
      {editingProduct && (
        <ModalOverlay>
          <ModalContent>
            <FormTitle>Edit Product</FormTitle>
            <ModalForm>
              <FormField>
                <InputLabel>Product Name</InputLabel>
                <Input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </FormField>
              <FormField>
                <InputLabel>Price</InputLabel>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  required
                />
              </FormField>
              <FormField>
                <InputLabel>Category</InputLabel>
                <Input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  required
                />
              </FormField>
              <FormField>
                <InputLabel>Image URL</InputLabel>
                <Input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  required
                />
              </FormField>
              <ModalActions>
                <Button onClick={() => setEditingProduct(null)}>Cancel</Button>
                <Button variant="primary" onClick={saveEdit}>Save Changes</Button>
              </ModalActions>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;