// import types from "../../types.json";
// import section from "../../sections.json";
import { Link } from "react-router-dom";
import { useProductContext } from "../contexts/productContext";


export default function Home(){
    const { products } = useProductContext();
    console.log(products);

    const types = Array.from(
        new Set(
            products.map(p => p?.types?.name || "General")
        )
    );

    const sections = Array.from(
        new Set(
            products.map(p => p?.section?.name || "Uncategorized")
        )
    );
    return(
        <div>
            <div className="container-fluid py-3">
            
                <div className="row d-flex flex-nowrap justify-content-center g-2 my-2 p-3">
                        {sections && sections.map((sectionCard, index) => (
                            <Link 
                                to={"/products"} 
                                className="col text-center rounded-3 m-1 text-decoration-none text-dark"
                                key={index}
                            >
                                <img 
                                src="https://images.unsplash.com/photo-1598032895397-b9472444bf93?..."
                                alt="shirt image"
                                className="card-img img-fluid rounded-3"
                                />
                                <p className="card-title mt-1 text-truncate small">
                                {sectionCard}
                                </p>
                            </Link>
                            ))}
                </div>
                
                
                    <div
                    id="mainCarousel" 
                    className="carousel slide carousel-fade" data-bs-ride="carousel"
                    data-bs-interval="3000" 
                    data-bs-pause="false" 
                    > 
                        <div className="carousel-inner rounded-4 " >
                        {
                           sections && [
                                       `https://marketplace.canva.com/EAFqA4K13MM/1/0/1600w/canva-69gdt76LZg0.jpg`,

                                        `https://marketplace.canva.com/EAGr1G0eTn0/1/0/640w/canva-8_PjovReKxY.jpg`,

                                        `https://marketplace.canva.com/EAG1qyyU8vE/1/0/1200w/canva-_oN-9X2Sn4Y.jpg`,
                                        
                                        `https://marketplace.canva.com/EAGZdjo91A4/1/0/640w/canva-gcYvMNoXJQk.jpg`].map((url, index) => (
                                            <div
                                                className={`carousel-item ${index === 0 ? "active" : ""}`} 
                                                key={index}
                                            >
                                            <Link 
                                                to={"/products"} 
                                                className="text-decoration-none text-dark w-100"
                                            >    
                                            <div  className="w-100"
                                                style={{
                                                height: "650px", 
                                                overflow: "hidden",
                                                backgroundColor: "#3f5046ff", 
                                                }}>
                                                <img 
                                                    src={ url } 
                                                    className="d-block mx-auto img-fluid" 
                                                     alt={`Slide ${index + 1}`}
                                                       style={{             
                                                        backgroundColor: "#0b0b0bff", 
                                                        }}
                                                /> 
                                                </div>
                                            </Link>
                                </div>
                                ))

                        }
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev"> 
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next"> 
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                        
                    </div>
                
                    <div >
                        <div className="types-scroll-container d-flex overflow-auto gap-3 py-3 px-2" style={{
                                scrollSnapType: 'x mandatory',
                                scrollbarWidth: 'none',
                            }}>
                                {types && types.map((typesCard, index) => (
                                    <Link 
                                        to={"/products"} 
                                        key={index}
                                        className="flex-shrink-0 text-center text-decoration-none"
                                        style={{
                                            width: '100px',
                                            scrollSnapAlign: 'start',
                                        }}
                                    >
                                        <img 
                                            src="https://images.unsplash.com/photo-1598032895397-b9472444bf93?..."
                                            alt="shirt image"
                                            className="card-img img-cover rounded-3"
                                        />
                                        <p className="card-title text-dark small mt-1">{typesCard}</p>
                                    </Link>
                                ))}
                            </div>
                    </div>
                    <div>
                        <div>
                             <Link 
                                        to={"/products"} 
                                        
                                        className="flex-shrink-0 text-center text-decoration-none"
                                        
                                    >
                            <img src="https://img.freepik.com/free-vector/special-offer-lettering-paint-blots_1262-8008.jpg?t=st=1762590667~exp=1762594267~hmac=9da8d84b61d2b7cc9efc1833683ccd177f8e6d78e16ec6278144a255e70d154a&w=2000" alt="offers" 
                            className="card-img img-fluid object-fit-cover rounded-3"
                            style= {{height: "600px"}}
                            />
                            </Link>
                        </div>
                    </div>
                    <div className="row d-flex flex-row my-2 g-2">
                        
                        <div className="col-6">
                             <Link 
                                        to={"/products"} 
                                        
                                        className="flex-shrink-0 text-center text-decoration-none"
                                        
                                    >
                                        <img src="https://img.freepik.com/premium-psd/summer-banner-design_656675-164.jpg?semt=ais_hybrid&w=740&q=80" alt="summer collection" 
                            className="card-img img-fluid rounded-3"/>
                                    </Link>
                            
                        </div>
                    
                   
                        <div className="col-6">
                             <Link 
                                        to={"/products"} 
                                        
                                        className="flex-shrink-0 text-center text-decoration-none"
                                      
                                    >
                            <img src="https://img.freepik.com/premium-psd/winter-clothes-sale-social-media-design-instagram-facebook_496781-634.jpg?ga=GA1.1.698302922.1762585794&semt=ais_hybrid&w=740&q=80" alt="winter collections" 
                            className="card-img img-fluid rounded-3"/>
                            </Link>
                        </div>
                    </div>
            </div>
        </div>
    )
}