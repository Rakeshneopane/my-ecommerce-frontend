// import products from "../../products.json";
import { useProductContext } from "../contexts/productContext";
import { useParams } from 'react-router-dom'

export default function ProductDetails(){
    const { products, changeQuantity } = useProductContext();
    const { productId } = useParams();
    console.log(productId)

    
    return (
        <div className="container">
            <div className="row">
                {products && products.filter(p=>p.id?.toString() === productId).map(product=>(
                <div key={product.id}>
                <div className="col-3">
                    <img src={product.images?.[0] || "https://placehold.co/200x200?text=No+Image"} alt="item image" className="img-fluid" />
                    <button>Buy Now</button>
                    <button>Add to Cart</button>
                </div>
                <div className="col-9">
                    <h2>{product.title}</h2>
                    <p>{product.rating} </p>
                    <p>{product.price}</p>
                    <p>Discount:</p>
                    <p>
                        Quantity:
                        <button onClick={() => changeQuantity(product.id, -1)}>-</button>
                        <span>{product.quantity || 1}</span>
                        <button onClick={() => changeQuantity(product.id, 1)}>+</button>
                        </p>
                    <p>Size: S M Xl XXL</p>
                    <hr />
                    <p> Description: </p>
                    <ul>
                        <li>Style</li>
                        <li>All weather</li>
                        <li>Unparallel Essential</li>
                    </ul>
                    </div>
                </div>
                ))
            }
                
            </div>
            <hr />
            <p>You may also like these</p>
            <div className="row">
            {products && products.map(product=>(
                <div className="col-3" key={product.id}>
                    <img src="https://placehold.co/100" alt="product image" />
                    <p>{product.title}</p>
                    <p>{product.price}</p>
                    <button>Add to cart</button>
                </div>
            ))}
            </div>
        </div>
    )
} 