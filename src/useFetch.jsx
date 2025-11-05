import { useState,useEffect } from "react";

export const useFetch = (url, initailData)=>{
    const [data,setData] = useState(initailData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setLoading(true);
         fetch(url).then(res=> res.json()).then(data=> setData(data)).catch(error=> setError(error)).finally(()=>setLoading(false));
    },[url])

    return {data,loading,error};
}

