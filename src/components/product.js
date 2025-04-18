import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Carousel as CarouselUI } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styled from 'styled-components';
import axios from 'axios';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

// Import images from assets
import image1 from '../assets/Images/image1.jpg';
import image2 from '../assets/Images/image2.jpg';
import image3 from '../assets/Images/image3.jpg';
import image4 from '../assets/Images/image1.jpg';
import shoe1 from '../assets/Images/shoe1.jpg';
import shoe2 from '../assets/Images/shoe2.jpg';
import shoe3 from '../assets/Images/shoe3.jpg';
import shoe4 from '../assets/Images/shoe4.jpg';
import shoe5 from '../assets/Images/shoe5.jpg';
import shoe6 from '../assets/Images/shoe6.jpg';
import shoe7 from '../assets/Images/shoe7.jpeg';
import shoe8 from '../assets/Images/shoe8.jpeg';
import shoe9 from '../assets/Images/shoe9.jpeg';
import shoe10 from '../assets/Images/shoe10.jpeg';
import shoe11 from '../assets/Images/shoe11.jpeg';
import shoe12 from '../assets/Images/shoe12.jpeg';
import shoe14 from '../assets/Images/shoe14.jpeg';
import shoe15 from '../assets/Images/shoe15.jpeg';
import shoe16 from '../assets/Images/shoe16.jpeg';

// Array of local images (15 images, shoe13.jpg missing)
const localImages = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6, shoe7, shoe8, shoe9, shoe10, shoe11, shoe12, shoe14, shoe15, shoe16];
const carouselImagesStatic = [image1, image2, image3, image4];

// ===============================
// Styled Components
// ===============================

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
`;

const Heading = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: #1a202c;
  letter-spacing: -0.02em;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 70px;
`;

const ProductCard = styled(motion.div)`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid #edf2f7;

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImageContainer = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7fafc;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const ProductInfo = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProductName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  letter-spacing: -0.02em;
`;

const ProductPrice = styled.p`
  font-size: 1.3rem;
  font-weight: 700;
  color: #e53e3e;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
`;

const StarIcon = styled(Star)`
  color: ${(props) => (props.filled ? '#f59e0b' : '#cbd5e0')};
  margin-right: 8px;
  width: 20px;
  height: 20px;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff7e67;
  }
`;

const QuantityButton = styled.button`
  background-color: #edf2f7;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e2e8f0;
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

const AddToCartButton = styled.button`
  padding: 15px 25px;
  background-color: #ff7e67;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #fc8181;
    transform: translateY(-4px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const CarouselContainer = styled.div`
  margin-bottom: 70px;
  width: 100%;
`;

const Carousel = styled(CarouselUI)`
  .carousel-root {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
    width: 100%;
  }
  .carousel-inner-wrapper {
    width: 100%;
  }
  .carousel-slide {
    width: 100%;
    height: 500px;
  }
  .carousel-slide img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  .carousel-dot {
    background-color: #a0aec0;
    box-shadow: none;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin: 0 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .carousel-dot.active {
    background-color: #ff7e67;
  }
  .carousel-prev,
  .carousel-next {
    background-color: #ff7e67;
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    transition: background-color 0.3s ease, opacity 0.3s ease;
    opacity: 0.8;
    &:hover {
      background-color: #fc8181;
      opacity: 1;
    }
  }
  .carousel-prev {
    left: 20px;
  }
  .carousel-next {
    right: 20px;
  }
  .carousel-prev:before {
    content: '<';
  }
  .carousel-next:before {
    content: '>';
  }
  .carousel-indicators {
    position: absolute;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  font-size: 1.5rem;
  margin-top: 30px;
  font-weight: 500;
`;

// ===============================
// Component
// ===============================

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState({});
  const [quantities, setQuantities] = useState({});
  const [cartItemCount, setCartItemCount] = useState(0);

  // Hardcoded customer_id for demo purposes
  const customerId = 1;

  const fetchProducts = async () => {
    const url = 'http://localhost:3000/api/products';
    console.log('ProductsPage fetching:', url);
    try {
      const response = await axios.get(url);
      const productsWithImages = response.data.map((product, index) => {
        console.log('Product:', product);
        return {
          ...product,
          image_url: localImages[index % localImages.length],
          price: Number(product.price) || 0,
        };
      });
      const imagePromises = productsWithImages.map(
        (product) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = product.image_url;
            img.onload = () => resolve(product);
            img.onerror = () => resolve(product);
          })
      );
      Promise.all(imagePromises).then(() => {
        setProducts(productsWithImages);
        setLoading(false);
      });
    } catch (err) {
      console.error('ProductsPage fetch error:', err.message);
      setError(err.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    const url = `http://localhost:3000/api/cart/${customerId}/count`;
    console.log('ProductsPage fetching cart count:', url);
    try {
      const response = await axios.get(url);
      setCartItemCount(response.data.itemCount || 0);
    } catch (err) {
      console.error('ProductsPage cart count error:', err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  const handleQuantityChange = (productId, value) => {
    const newValue = Math.max(1, Number(value));
    setQuantities((prev) => ({ ...prev, [productId]: newValue }));
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] || 1;
    setCartLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const url = 'http://localhost:3000/api/cart';
      console.log('ProductsPage adding to cart:', url, { customerId, productId, quantity });
      await axios.post(url, {
        customer_id: customerId,
        product_id: productId,
        quantity,
      });
      toast.success(`Added ${quantity} item(s) to cart!`);
      setQuantities((prev) => ({ ...prev, [productId]: 1 })); // Reset quantity
      fetchCartCount(); // Update cart count
    } catch (err) {
      console.error('ProductsPage add to cart error:', err.message);
      toast.error('Failed to add product to cart');
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Loader2 size={60} className="animate-spin text-gray-500" />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <>
      <Navbar cartItemCount={cartItemCount} />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Heading>Our Products</Heading>

        {/* Carousel */}
        {carouselImagesStatic.length > 0 ? (
          <CarouselContainer>
            <Carousel showThumbs={false} autoPlay infiniteLoop>
              {carouselImagesStatic.map((image, index) => (
                <div key={index} style={{ width: '100%' }}>
                  <img
                    src={image}
                    alt={`Carousel ${index + 1}`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </Carousel>
          </CarouselContainer>
        ) : (
          <CarouselContainer>
            <img
              src="https://via.placeholder.com/400?text=No+Images+Available"
              alt="No carousel images"
              style={{ width: '100%', height: '500px', objectFit: 'cover' }}
            />
          </CarouselContainer>
        )}

        {/* Product Grid */}
        <ProductGrid>
          {products.map((product) => (
            <ProductCard
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImageContainer>
                <ProductImage
                  src={product.image_url || 'https://via.placeholder.com/250?text=No+Image'}
                  alt={product.name || 'Product'}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/250?text=No+Image';
                  }}
                />
              </ProductImageContainer>
              <ProductInfo>
                <ProductName>{product.name || 'Unknown Product'}</ProductName>
                <ProductPrice>₹{formatPrice(product.price)}</ProductPrice>
                <Rating>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < Math.floor(Math.random() * 5)} />
                  ))}
                </Rating>
                <QuantitySelector>
                  <QuantityButton
                    onClick={() => handleQuantityChange(product.product_id, (quantities[product.product_id] || 1) - 1)}
                    disabled={(quantities[product.product_id] || 1) <= 1}
                  >
                    -
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    min="1"
                    value={quantities[product.product_id] || 1}
                    onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(product.product_id, (quantities[product.product_id] || 1) + 1)}
                  >
                    +
                  </QuantityButton>
                </QuantitySelector>
                <AddToCartButton
                  onClick={() => handleAddToCart(product.product_id)}
                  disabled={cartLoading[product.product_id]}
                >
                  {cartLoading[product.product_id] ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  {cartLoading[product.product_id] ? 'Adding...' : 'Add to Cart'}
                </AddToCartButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </Container>
    </>
  );
};

export default ProductsPage;