import axios from 'axios';
import './App.css';
import { useState, useEffect } from "react";

const API_URL = "https://express-ecommerce-crud-production.up.railway.app";

function App() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addErrors, setAddErrors] = useState({});

  // Edit Product
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editErrors, setEditErrors] = useState({});

  // Delete Product Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get Products
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Validation
  const validate = (titleVal, priceVal, descriptionVal) => {
    const errors = {};

    if (!titleVal || titleVal.trim() === "") {
      errors.title = "Title is required";
    }

    if (priceVal === "" || priceVal === null || priceVal === undefined) {
      errors.price = "Price is required";
    } else if (isNaN(Number(priceVal))) {
      errors.price = "Price must be a valid number";
    } else if (Number(priceVal) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!descriptionVal || descriptionVal.trim() === "") {
      errors.description = "Description is required";
    }

    return errors;
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const errors = validate(title, price, description);

    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    setAddErrors({});

    try {
      const response = await axios.post(`${API_URL}/add-product`, {
        title: title,
        price: Number(price),
        description: description,
        imageUrl: imageUrl,
      });

      if (response.data.status === "success") {
        setTitle("");
        setPrice("");
        setDescription("");
        setImageUrl("");
        setShowAddModal(false);
        getProducts();
      }
    } catch (error) {
      // Backend validation error
      if (error.response?.data?.errors) {
        setAddErrors(error.response.data.errors);
      }

      console.log("error", error);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/product/${id}`);

      if (response.data.status === "success") {
        getProducts();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Start Editing
  const startEditing = (product) => {
    setEditingId(product.id);
    setEditTitle(product.title);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditImageUrl(product.imageUrl || "");
    setEditErrors({});
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditErrors({});
  };

  // Update Product
  const handleUpdateProduct = async (id) => {
    const errors = validate(
      editTitle,
      editPrice,
      editDescription
    );

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setEditErrors({});

    try {
      const response = await axios.put(`${API_URL}/product/${id}`, {
        title: editTitle,
        price: Number(editPrice),
        description: editDescription,
        imageUrl: editImageUrl,
      });

      if (response.data.status === "success") {
        setEditingId(null);
        getProducts();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setEditErrors(error.response.data.errors);
      }

      console.log("error", error);
    }
  };

  // Close Add Modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setAddErrors({});
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <span className="logo">Products</span>

        <div className="nav-links">
          <button>Home</button>
          <button>About</button>
          <button>Contact</button>
        </div>
      </nav>


      {/* Toolbar */}
      <div className="toolbar">
        <h1>All Products</h1>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Product
        </button>
      </div>


      {/* Product Grid */}
      <div className="container">

        {products.length === 0 ? (

          <div className="empty-state">
            <p>No products found</p>
            <span>Click "+ Add Product" to get started</span>
          </div>

        ) : (

          <div className="product-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                {/* Edit Mode */}
                {editingId === product.id ? (

                  <div className="edit-mode">

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className={
                        editErrors.title ? "input-error" : ""
                      }
                    />

                    {editErrors.title && (
                      <span className="error-text">
                        {editErrors.title}
                      </span>
                    )}


                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="Price"
                      className={
                        editErrors.price ? "input-error" : ""
                      }
                    />

                    {editErrors.price && (
                      <span className="error-text">
                        {editErrors.price}
                      </span>
                    )}


                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="Image URL"
                    />


                    <textarea
                      value={editDescription}
                      onChange={(e) =>
                        setEditDescription(e.target.value)
                      }
                      placeholder="Description"
                      className={
                        editErrors.description
                          ? "input-error"
                          : ""
                      }
                    />

                    {editErrors.description && (
                      <span className="error-text">
                        {editErrors.description}
                      </span>
                    )}


                    <div className="edit-actions">

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          handleUpdateProduct(product.id)
                        }
                      >
                        Save
                      </button>

                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  <>
                    {/* Product Image */}

                    {product.imageUrl ? (

                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="card-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />

                    ) : null}


                    {/* Image Placeholder */}

                    <div
                      className="card-image-placeholder"
                      style={{
                        display: product.imageUrl
                          ? "none"
                          : "flex"
                      }}
                    >
                      {product.title.charAt(0).toUpperCase()}
                    </div>


                    <span className="badge">
                      In Stock
                    </span>


                    <h3>{product.title}</h3>

                    <p className="description">
                      {product.description}
                    </p>


                    {/* Card Footer */}

                    <div className="card-footer">

                      <span className="price">
                        ${product.price}
                      </span>


                      <div className="card-actions">

                        {/* Edit Button */}

                        <button
                          className="icon-btn"
                          onClick={() =>
                            startEditing(product)
                          }
                          title="Edit"
                        >
                          Edit
                        </button>


                        {/* Delete Button */}

                        <button
                          className="icon-btn icon-btn-danger"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          title="Delete"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </>

                )}

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ========================= */}
      {/* Delete Product Modal */}
      {/* ========================= */}

      {showDeleteModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <h2>Delete Product</h2>

              <button
                className="modal-close"
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                ×
              </button>

            </div>


            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedProduct?.title}
              </strong>
              ?
            </p>


            <div className="edit-actions">

              {/* Cancel */}

              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  setShowDeleteModal(false)
                }
              >
                Cancel
              </button>


              {/* Confirm Delete */}

              <button
                className="btn btn-sm icon-btn-danger"
                onClick={() => {
                  handleDeleteProduct(
                    selectedProduct.id
                  );

                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ========================= */}
      {/* Add Product Modal */}
      {/* ========================= */}

      {showAddModal && (

        <div
          className="modal-overlay"
          onClick={closeAddModal}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <h2>Add New Product</h2>

              <button
                className="modal-close"
                onClick={closeAddModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleAddProduct}
              className="modal-form"
              noValidate
            >

              {/* Title */}

              <label>

                <span>Title</span>

                <input
                  type="text"
                  placeholder="e.g. Smart Watch"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className={
                    addErrors.title
                      ? "input-error"
                      : ""
                  }
                />

                {addErrors.title && (
                  <span className="error-text">
                    {addErrors.title}
                  </span>
                )}

              </label>


              {/* Image URL */}

              <label>

                <span>Image URL</span>

                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(e.target.value)
                  }
                />

              </label>


              {/* Price */}

              <label>

                <span>Price (Rs.)</span>

                <input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  className={
                    addErrors.price
                      ? "input-error"
                      : ""
                  }
                />

                {addErrors.price && (
                  <span className="error-text">
                    {addErrors.price}
                  </span>
                )}

              </label>


              {/* Description */}

              <label>

                <span>Description</span>

                <textarea
                  placeholder="Short description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className={
                    addErrors.description
                      ? "input-error"
                      : ""
                  }
                />

                {addErrors.description && (
                  <span className="error-text">
                    {addErrors.description}
                  </span>
                )}

              </label>


              {/* Submit */}

              <button
                type="submit"
                className="btn btn-primary btn-full"
              >
                Add Product
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;