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
                                className="card-img image-fluid rounded-3"
                                />
                                <p className="card-title mt-1 text-truncate small">
                                {sectionCard}
                                </p>
                            </Link>
                            ))}
                </div>
                
                
                    <div
                    id="mainCarousel" 
                    className="carousel slide carousel-fade" data-bs-ride="carousel"> 
                        <div className="carousel-inner rounded-4">
                        {
                           sections && sections.map((carousel, index) => (
                                <div
                                    className={`carousel-item ${index === 0 ? 'active' : ''}`} 
                                    key={index}
                                >
                                    <img 
                                    src={`https://placehold.co/600x400?text=Hello+World+${index}`} 
                                    className="d-block w-100" 
                                    alt="Placeholder" 
                                    /> 
                                </div>
                                ))

                        }
                        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev"> 
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next"> 
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                        </div>
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
                                            className="card-img image-fluid rounded-3"
                                        />
                                        <p className="card-title text-dark small mt-1">{typesCard}</p>
                                    </Link>
                                ))}
                            </div>
                    </div>
                    <div>
                        <div>
                            <img src="https://placehold.co/600x400?text=Offers" alt="" 
                            className="card-img image-fluid"/>
                        </div>
                    </div>
                    <div className="row d-flex flex-row my-2 g-2">
                        
                        <div className="col-6">
                            <img src="https://placehold.co/600x400?text=Summer+Collections" alt="" 
                            className="card-img image-fluid"/>
                        </div>
                    
                   
                        <div className="col-6">
                            <img src="https://placehold.co/600x400?text=Winter+Collections" alt="" 
                            className="card-img image-fluid"/>
                        </div>
                    </div>
            </div>
        </div>
    )
}