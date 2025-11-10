import {useState} from "react";


export default function CreateProduct(){

    const [formData, setFormData] = useState({
        title: "",
        price: 0,
        category: "",
        rating: 0,
        sellerId: "",
        stock: 0,
        images: "",
    })
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const payLoad = {
            ...formData,
            images: formData.images.split(",").map(img=> img.trim()).filter(img=> img !== "")
        }
        const url = "https://my-ecommerce-eta-ruby.vercel.app/api/create-products"
        try {
             const response = await fetch(url,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payLoad)
                })
            if(!response.ok) return;
            const data = await response.json();
            console.log("The product data", data);

            setFormData({
                title: "",
                price: 0,
                category: "",
                rating: 0,
                sellerId: "",
                stock: 0,
                images: "",
            }) 
        } catch (error) {
            throw error;            
        }
    }

    return(
        <div className="container">
            <div>
                <form action="" onSubmit={(e)=>handleSubmit(e)} className="form">
                    <label htmlFor="" className="form-label">Product Title:</label>
                    <input type="text" name="" id="" 
                    className="form-control"
                    value={formData.title}
                    onChange={(e)=>setFormData(prev=>({...prev,title: e.target.value}) )}
                    />

                    <label htmlFor="">Product Price</label>
                    <input type="Number" name="" id="" 
                    className="form-control"
                    value={formData.price}
                    onChange={(e)=>setFormData(prev=>({...prev,price: e.target.value}) )}
                    />

                    <label htmlFor="">Category</label>
                    <input type="text" name="" id="" 
                    className="form-control"
                    value={formData.category}
                    onChange={(e)=>setFormData(prev=>({...prev,category: e.target.value}) )}
                    />

                    <label htmlFor="">Seller ID:</label>
                    <input type="text" name="" id="" 
                    className="form-control"
                    value={formData.rating}
                    onChange={(e)=>setFormData(prev=>({...prev,rating: e.target.value}) )}
                    />

                    <label htmlFor="">Stock</label>
                    <input type="Number" name="" id="" 
                    className="form-control"
                    value={formData.sellerId}
                    onChange={(e)=>setFormData(prev=>({...prev,sellerId: e.target.value}) )}
                    />

                    <label htmlFor="">Rating</label>
                    <input type="Number" name="" id="" 
                    className="form-control"
                    value={formData.stock}
                    onChange={(e)=>setFormData(prev=>({...prev,stock: e.target.value}) )}
                    />

                    <label htmlFor="">Images</label>
                    <input type="text" name="" id="" 
                    className="form-control"
                    value={formData.images}
                    onChange={(e)=>setFormData(prev=>({...prev,images: e.target.value}) )}
                    />

                    <button>Submit</button>
                </form>
            </div>
        </div>
    )
}