import axios from "axios";

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
});


//fetch the data
export const fetchPosts= (start,limit)=>{
    return api.get(`/posts?_start=${start}&_limit=${limit}`); // limit=10 means 10 number of data items milenge
};



//fetch individual data
export const fetchInvPost= async (id)=>{
    try{
        const res= await api.get(`posts/${id}`);
        return res.status === 200 ? res.data : [] ;
    }catch(error){
        console.error(error);
    }
};


//to delete the post
export const deletePost= (id)=>{
    return api.delete(`/posts/${id}`);
}


//to update the post
export const updatePost= (id)=>{
    return api.patch(`/posts/${id}`, {title: "I have updated"}); // patch updates partially
}



// Infinite Scrolling
export const fetchUsers= async({pageParam = 1})=>{ // pageParam is the pageNumber
    try{
        const res= await axios.get(`https://api.github.com/users?per_page=10&page=${pageParam}`)
        return res.data;      
    }catch(error){
        console.error(error);
    }
};  