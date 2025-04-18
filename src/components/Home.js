import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import Navbar from './Navbar'; // Import the Navbar component

// --- Image Imports ---
import image1 from '../assets/Images/image1.jpg'; // Import image1.jpg
import image2 from '../assets/Images/image2.jpg'; // Import image2.jpg
import image3 from '../assets/Images/image3.jpg'; // Import image3.jpg
import image4 from '../assets/Images/image1.jpg';
import shoe1 from '../assets/Images/shoe1.jpg';// Import image4.jpg
import shoe2 from '../assets/Images/shoe2.jpg';
import shoe3 from '../assets/Images/shoe3.jpg';
import shoe4 from '../assets/Images/shoe4.jpg';
import shoe5 from '../assets/Images/shoe5.jpg';
import shoe6 from '../assets/Images/shoe6.jpg';
import store1 from '../assets/Images/storeimage1.jpg';
import store2 from '../assets/Images/storeimage2.jpg';
import store3 from '../assets/Images/storeimage3.jpg';

// --- Reusable Styles ---
const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
`;

const Button = styled(Link)`
    display: inline-block;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;
`;

// --- Component-Specific Styles ---

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f4f4;
`;

const Header = styled.header`
    background-color: #fff;
    color: #222;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;



const HeroSlider = styled(Carousel)`
    /* You can add custom styles here if needed */
    height: 60vh;
    
    .slide {
        height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 2rem;
        text-align: center;
    }
    
     .slide img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }

    .carousel-indicators li {
        background-color: rgba(0, 0, 0, 0.5);
        &.active {
            background-color: #007bff;
        }
    }
    .carousel-arrow{
        background-color: rgba(0, 0, 0, 0.5);
        
        &:hover{
             background-color: rgba(0, 0, 0, 0.7);
        }
    }
`;


const HeroContent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    padding: 20px;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
`;

const HeroTitle = styled.h1`
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #222;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const HeroSubtitle = styled.p`
    font-size: 1.5rem;
    margin-bottom: 30px;
    color: #444;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const ShopNowButton = styled(Link)`
    background-color: #007bff;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 5px;
    font-size: 1.2rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;

    &:hover {
        background-color: #0056b3;
    }
`;

const FeaturedProductsSection = styled.section`
    padding: 60px 0;
    text-align: center;
    background-color: #f4f4f4;
`;

const FeaturedTitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 40px;
    color: #222;
    text-align: center;
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    margin-top: 40px;
`;

const ProductCard = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
`;

const ProductImage = styled.img`
    width: 100%;
    border-radius: 10px;
    margin-bottom: 20px;
    height: 200px;
    object-fit: cover;
`;

const ProductName = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #222;
`;

const ProductPrice = styled.p`
    font-size: 1.5rem;
    font-weight: 700;
    color: #007bff;
    margin-bottom: 15px;
`;

const ViewProductButton = styled(Link)`
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;

    &:hover {
        background-color: #0056b3;
    }
`;
const SiteFooter = styled.footer`
    padding: 30px 0;
    text-align: center;
    background-color: #222;
    color: #eee;
    font-size: 0.9rem;
    margin-top: auto;
`;

// New Component for CDC Experience Section
const CdcExperienceSection = styled.section`
    padding: 60px 0;
    text-align: center;
    background-color: #ffffff; // Background color for the section
`;

const CdcExperienceTitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 40px;
    color: #222;
    text-align: center;
`;

const CdcLocations = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    
`;

const CdcLocationBox = styled.div`
    position: relative;
    width: 300px; /* Adjust as needed */
    height: 200px; /* Adjust as needed */
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(70%); /* Darken image slightly */
    }

    span {
        position: relative; /* Ensure text is above the image */
        z-index: 1;
        padding: 10px;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
    }
`;

const LocationInput = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([
        {
            id: 1,
            name: 'Running Shoe Alpha',
            brand: 'Brand A',
            price: 15000,
            imageUrl: shoe1, // Using imported image
        },
        {
            id: 2,
            name: 'Basketball Shoe Beta',
            brand: 'Brand B',
            price: 20000,
            imageUrl: shoe2, // Using imported image
        },
        {
            id: 3,
            name: 'Training Shoe Gamma',
            brand: 'Brand C',
            price: 12000,
            imageUrl: shoe3, // Using imported image
        },
        {
            id: 4,
            name: 'Casual Shoe Delta',
            brand: 'Brand D',
            price: 10000,
            imageUrl: shoe4, // Using imported image
        },
         {
            id: 5,
            name: 'Running Shoe Epsilon',
            brand: 'Brand E',
            price: 17500,
            imageUrl: shoe5,
        },
        {
             id: 6,
            name: 'Outdoor Shoe Zeta',
            brand: 'Brand F',
            price: 22000,
            imageUrl: shoe6,
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const slides = [
        {
            imageUrl: image1, // Using imported image

        },
        {
            imageUrl: image2, // Using imported image

        },
        {
            imageUrl: image3, // Using imported image

        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                //  Replace '/api/products/featured' with your actual API endpoint
                // const response = await fetch('http://localhost:5050/api/products/featured');
                // if (!response.ok) {
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }
                // const data = await response.json();
                // setFeaturedProducts(data);  //  Map your API data to the featuredProducts state
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };
        // fetchData(); // Removed this, using hardcoded data for now
    }, []);

    return (
        <HomeContainer>
            <Header>
                <Navbar />
            </Header>
            <HeroSlider
                autoPlay={true}
                interval={5000}
                showThumbs={false}
                infiniteLoop={true}
                showIndicators={true}

            >
                {slides.map((slide, index) => (
                    <div key={index} className="slide" style={{  }}>
                        <img src={slide.imageUrl} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </HeroSlider>

            <FeaturedProductsSection>
                <Container>
                    <FeaturedTitle>Featured Products</FeaturedTitle>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <ProductGrid>
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id}>
                                    <ProductImage src={product.imageUrl} alt={product.name} />
                                    <ProductName>{product.name}</ProductName>
                                     <p>Brand: {product.brand}</p>
                                    <ProductPrice>₹{product.price}</ProductPrice>
                                   
                                </ProductCard>
                            ))}
                        </ProductGrid>
                    )}
                </Container>
            </FeaturedProductsSection>
            <CdcExperienceSection>
                <Container>
                    <CdcExperienceTitle>Acha Kicks</CdcExperienceTitle>
                    <CdcLocations>
                        <CdcLocationBox>
                            <img src={store1} alt="Delhi ChA.K.A. Kicks Store" />
                            <span>Delhi</span>
                        </CdcLocationBox>
                        <CdcLocationBox>
                            <img src={store2} alt="Mumbai ChA.K.A. Kicks Store" />
                            <span>Mumbai</span>
                        </CdcLocationBox>
                        <CdcLocationBox>
                            <img src={store3} alt="Hyderabad ChA.K.A. Kicks Store" />
                            <span>Hyderabad</span>
                        </CdcLocationBox>
                    </CdcLocations>
                    
                </Container>
            </CdcExperienceSection>

            <SiteFooter>
                <p>&copy; {new Date().getFullYear()} Shoe Store. All rights reserved.</p>
            </SiteFooter>
        </HomeContainer>
    );
};

export default Home;

