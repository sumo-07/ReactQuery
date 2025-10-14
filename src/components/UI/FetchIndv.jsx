import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";
import { fetchInvPost } from "../../api/api";

export const FetchIndv = () => {

    const { id } = useParams();
    const { data, isPending, isError, error } = useQuery({ // error is the error object
        queryKey: ["post", id], // like useState(),   this is the unnique key that identifies the data you're fetching, if another component also uses queryKey: ["posts"], it'll reuse the cached data instead of refetching from the server, so it must be unique
        queryFn: () => fetchInvPost(id), //like useEffect(),   
        staleTime: 5000,

    });

    console.log("data= ", data)



    if (isPending) return <p>Loading...</p>
    if (isError) return <p>Error: {error.message || "Something went wrong!"}</p>


    return (
        <div className="section-details">
            <h1>Post ID Number- {id}</h1>
            <div>
                <p>ID: {data.id}</p>
                <p>Title: {data.title}</p>
                <p>Body: {data.body}</p>
            </div>
            <NavLink to="/rq" >
                <button>Go Back</button>
            </NavLink>
        </div>
    );
};