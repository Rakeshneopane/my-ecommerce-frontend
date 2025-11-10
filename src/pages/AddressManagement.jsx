import { useState } from "react";
import { useUserContext } from "../contexts/userContext";

export default function AddressManagement(){
    const { user, saveUser } = useUserContext();
    console.log("User in AddressManagement:", user);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [addressData, setAddressData] = useState({
        area: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        alternatePhone: "",
        addressType: "",
    })

    const handleSubmit =async(e)=>{
        e.preventDefault();
        setLoading(true);

       
        if (!user?._id) {
            setError("Please create a user first.");
            setLoading(false);
            return;
        }

        const url = `https://my-ecommerce-eta-ruby.vercel.app/api/users/${user._id}/addresses`
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(addressData),
            })

            if(!response.ok){
                throw new Error(`HTTP response status ${response.status}.`)
            }

            const data = await response.json();
            console.log("Address saved:", data);

            saveUser({
                ...user,
                addresses: [...(user?.addresses || []), data.address],
            });

            localStorage.setItem("addressId", data.address._id);

            setSuccess("Address saved sucessfully");
            setError(null);
            setAddressData({
                area: "",
                city: "",
                state: "",
                pincode: "",
                landmark: "",
                alternatePhone: "",
                addressType: "",
            });
            
        } catch (error) {
            console.error(error);
            setSuccess(null);
            setError(`Failed to save address, error status: ${error.message} Please try again. `)            
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="container">
            <div className="card p-3 my-4">
                <div className="form">
                    <form action="" onSubmit={(e)=>handleSubmit(e)}>
                    <p>Manage Address</p>
                    
                    <textarea 
                        name="area" 
                        placeholder="Address(Area and street.)"
                        value={addressData.area}
                        onChange={(e)=>setAddressData((prev)=>({...prev, area: e.target.value}))}
                        required
                        className="form-control"
                        ></textarea>
                        <br />
                       
                    <input 
                        type="text"
                        name="city"
                        placeholder="City/District/Town"
                        value={addressData.city}
                        onChange={(e)=>setAddressData((prev)=>({...prev, city: e.target.value}))}
                        className="form-control"
                        required
                        />
                        <br />
                        
                    <select 
                        name="state" 
                        placeholder="state"
                        value={addressData.state}
                        onChange={(e)=>setAddressData((prev)=>({...prev, state: e.target.value}))}
                        required
                        className="form-control"
                        >
                        <option value="">Select State</option>
                        <option value="Assam"> Assam </option>
                        <option value="Manipur"> Manipur </option>
                        <option value="Mizoram"> Mizoram </option>
                        <option value="Meghalaya"> Meghalaya </option>
                        <option value="Nagaland"> Nagaland </option>
                        <option value="Tripura"> Tripura </option>
                    </select>
                    <br />
                    
                    <input 
                        type="number" 
                        name="pincode" 
                        placeholder="Pincode"
                        value={addressData.pincode}
                        onChange={(e)=>setAddressData((prev)=>({...prev, pincode: e.target.value}))}
                        className="form-control" 
                        required
                    />
                    <br />
                    <input 
                        type="text" 
                        name="landmark" 
                        placeholder="Landmark (optional)"
                        value={addressData.landmark}
                        onChange={(e)=>setAddressData((prev)=>({...prev, landmark: e.target.value}))}
                        className="form-control"
                        />
                    <br />
                    
                    <input 
                        type="text"     
                        name="alternate phone"
                        placeholder="Alternate Phone (optional)"
                        value={addressData.alternatePhone}
                        onChange={(e)=>setAddressData((prev)=>({...prev, alternatePhone: e.target.value}))}
                        className="form-control"
                    />
                    <br />
                    <br />
                    <p>Address Type</p>
                    <input 
                        type="radio" 
                        name="addressType"
                        value="Home"
                        checked= {addressData.addressType === "Home"}
                        onChange={(e)=>setAddressData((prev)=>({...prev, addressType: e.target.value}))}
                        required 
                        
                        /> Home 
                    {"  "}
                    <input 
                        type="radio" 
                        name="addressType" 
                        value="Work"
                        checked={addressData.addressType === "Work"}
                        onChange={(e)=>setAddressData((prev)=>({...prev, addressType: e.target.value}))}
                        required
                       
                        /> Work

                        <br />
                        <br />

                    <button type="submit" disabled={loading}  className=" btn btn-primary"> {loading ? "Saving..." : "Save"} </button>
                    </form>
                    {success && <p>{success}</p>}
                    {error && <p>{error}</p>}
                </div>
            </div>
        </div>
    )
}