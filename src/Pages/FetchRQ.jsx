import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, fetchPosts, updatePost } from "../api/api";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export const FetchRQ = () => {

    const [pageNumber, setPageNumber] = useState(0);
    const [filter, setFilter] = useState(3);

    const getPostData = async (pageNumber, filter) => {
        const start = pageNumber * filter;
        try {
            const res = await fetchPosts(start, filter);
            return res.status === 200 ? res.data : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const queryClient= useQueryClient();

    const { data, isPending, isError, error, isFetching } = useQuery({ // error is the error object
        queryKey: ["posts", pageNumber, filter], // like useState(),   this is the unnique key that identifies the data you're fetching, if another component also uses queryKey: ["posts"], it'll reuse the cached data instead of refetching from the server, so it must be unique
        queryFn: () => getPostData(pageNumber, filter), //like useEffect(),   
        // gcTime: 1000 * 60 * 5, // default time 5min hota hai , removes cache after this much time of inactivity, referesh krne pe component unmounts and then remounts again, so cache data bhi clear hojayega and baaki cheeze bhiii
        staleTime: 5000,
        // refetchInterval: 1000, // this is called polling
        // refetchIntervalInBackground: true,
        placeholderData: keepPreviousData, // jb page aage kr rhe hai toh loading ata hai, issko lgaane ke baad woh tb tk purana data dikhata hai(pichle page ka) and jb nya data ajata hai toh use display krdeta hai, issee loading nhi ata hai
    });

    //mutation function to delete the post
    const deleteMutation= useMutation({
        mutationFn: (id)=> deletePost(id),
        onSuccess: (data, id)=>{
            console.log(data,id);
            
            queryClient.setQueryData(["posts", pageNumber, filter], (currElem)=>{
                return currElem?.filter((post)=> post.id !== id);
            }); // queryClient.setQueryData is used to update the cached data for a specific query.


        }
    });

    //mutation function to update the post
    const updateMutation= useMutation({
        mutationFn: (id)=> updatePost(id),
        onSuccess: (apiData, postId)=>{
            console.log(apiData, postId);
            queryClient.setQueryData(["posts", pageNumber, filter], (postsData)=>{
                return postsData?.map((currPost)=> {
                    return currPost.id === postId ? {...currPost, title: apiData.data.title} : currPost;
                });
            });
        }
    })

    //filter
    const handleSelectChange = (e) => {
        e.preventDefault();
        setFilter(Number(e.target.value));
    }

    //isLoading() ---> doubt---> diff between isLoading and isPending
    if (isPending) return <p>Loading...</p> // first loading ke liye isPending, and uske baad isPending stays false
    if (isError) return <p>Error: {error.message || "Something went wrong!"}</p>


    return (
        <div>
            <ul className="section-accordion">
                {data?.map((currElem) => {
                    const { id, title, body } = currElem;
                    return (
                        <li key={id} >
                            <NavLink to={`/rq/${id}`} >
                                <p>{id}</p>
                                <p>{title}</p>
                                <p>{body}</p>
                            </NavLink>
                            {/* .mutate()---> bolta hai ki run krdo mutation function ko jise useMutation ke andar bnaaya hai */}
                            <button onClick={()=> deleteMutation.mutate(id)} >Delete</button> 
                            <button onClick={()=> updateMutation.mutate(id)} >Update</button> 
                        </li>
                    );
                })}
            </ul>

            <div className="controls-wrapper">
                <div className="pagination-section container">
                    <button disabled={pageNumber === 0 || isFetching} onClick={() => setPageNumber((prev) => prev - 1)} >Prev</button>
                    {/* mereko pta tha res.data mei 100 posts hai isliye nikaal liya total pages wrna nhi nikaal jaa skta because api endpoint mei limit hai jisse woh current res mei jitne post mile uski length btayega */}
                    <p> {pageNumber + 1} of {Math.ceil(100 / filter)}</p>
                    {/* there is one problem, iss next button ko last post ke baad disable kaise kru */}
                    <button disabled={ isFetching} onClick={() => setPageNumber((prev) => prev + 1)} >Next</button>
                </div>
                <div>
                    <select className="select-section" value={filter} onChange={handleSelectChange}>
                        <option value={3}>3</option>
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                    </select>
                     
                </div>
            </div>
        </div>
    );
};