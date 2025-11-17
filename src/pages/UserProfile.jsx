import { useUserContext } from "../contexts/userContext";
import {useState, useEffect} from "react";
import { Link } from 'react-router-dom';

export default function UserProfile (){
    const { user, saveUser,logout } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        gender: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (user) {
        setFormData({
            name: user.name || "",
            surname: user.surname || "",
            gender: user.gender || "",
            email: user.email || "",
            phone: user.phone || "",
        });
        }
    }, [user]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        const url = "https://my-ecommerce-eta-ruby.vercel.app/api/users"
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData) 
            });

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json();
            console.log("Data in userProfile", data);            
            
            saveUser(data.user);
            localStorage.setItem("userId", data.user._id);

            setSuccess("User saved successfully!");
            setFormData({ name: "", surname: "", gender: "", email: "", phone: "" });
            setError(null);
        } catch (error) {
            setSuccess(null);
            setError("Failed to save user. Please try again.");
        } finally{setLoading(false)}
    }
    return(
        <>
        <div className="container card p-3 my-4">
        { user && (
            <div className="">
                <div className="card p-2 my-2">
                    <p>Account user: {user.name} {user.surname}</p>
                    <p>Gender: {user.gender}</p>      
                    <p>Email: {user.email}</p>  
                    <p>Phone: {user.phone}</p>
                    </div>
                <div className="card p-2 m-2">
                        {user.addresses.map((address, index)=>(
                            <div key={index}>
                                <p>Area: {address.area}</p>
                                <p>City: {address.city}</p>
                                <p>State: {address.state}</p>
                                <p>Pin: {address.pincode}</p>
                                {address?.type && <p>Address Type: {address.type}</p>}
                            </div>
                        ))}
                    </div>
            </div>
        ) }
        
           { !user && <div className="form">
            <form action="" onSubmit={(e)=>handleSubmit(e)}>
                <label htmlFor="" className="form-label">
                    <p> Personal Information </p> 
                </label>
                    <input 
                        type="text"  
                        value={formData.name} 
                        onChange={(e)=>setFormData((prev)=>({...prev, name: e.target.value}))} 
                        placeholder="your first name"
                        required
                        className="form-control"
                    />
                    <br />
                    <input 
                        type="text" 
                        value={formData.surname} 
                        onChange={(e)=>setFormData((prev)=>({...prev, surname: e.target.value}))} 
                        placeholder="your last name"
                        required
                        className="form-control"
                    />
                
                <br />
                <label htmlFor="" className="form-label"  >
                    <p>Your Gender</p>
                     </label>
                     <br />
                    <input 
                        type="radio" 
                        name="gender" 
                        checked={formData.gender === "male"} 
                        value={"male"}  
                        onChange={(e) =>setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                        required
                        /> Male
                        {"  "}
                    <input 
                        type="radio" 
                        name="gender" 
                        checked={formData.gender === "female"} 
                        value={"female"} 
                        onChange={(e) =>setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                        required
                        /> Female
               
                <br />
                <br />
                <label htmlFor=""  className="form-label">
                    <p> Email Address </p>
                </label>
                    <input 
                        type="email"  
                        value={formData.email} 
                        onChange={(e)=>setFormData((prev)=>({...prev, email: e.target.value}))} 
                        placeholder="your email"
                        required
                         className="form-control"
                    />
                
                <br />
                <label htmlFor=""  className="form-label">
                   <p> Mobile Number </p> 
                </label>   
                    <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={(e)=>setFormData((prev)=>({...prev, phone: e.target.value}))} 
                        placeholder="your phone number" 
                        required
                        className="form-control"
                    />
                <br />
                <br />
                <button type="submit" disabled={loading} className="btn btn-primary"> {loading ? "Saving..." : "Submit"} </button>
            </form>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
            </div>}
            <br />
            <div>
                <Link to="/address" className="btn btn-primary">Add Address</Link>                   
            </div>
        
        </div>
        </>
    )
}