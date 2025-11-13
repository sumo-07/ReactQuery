import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/api";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer"; //react intersection observer detect krta hai ki woh particular element kb visible(or invisible) hora  hai viewport mei


export const InfiniteScroll = () => {

    const { data, hasNextPage, fetchNextPage, status, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
        getNextPageParam: (lastPage, allPages) => {
            console.log("lastpage= ", lastPage, allPages);
            return lastPage?.length === 10 ? allPages.length + 1 : undefined; // iska returned result becomes pageParam for the next page
        },
    });

    console.log("data= ", data);

    // const handleScroll = () => {
    //     const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

    //     if (bottom && hasNextPage) {
    //         fetchNextPage(); // this will call the queryFn({pageParam: 2}), suppose kiya hai woh "2" idhar
    //     }
    // }

    const { ref, inView } = useInView({
        threshold: 1, // jb woh viewport mei full visible hai
    });

    useEffect(() => {
        // window.addEventListener("scroll", handleScroll);
        // return () => window.removeEventListener("scroll", handleScroll);

        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    console.log(status);
    if (status === "loading") return <div className="status-message">Loading...</div>;
    if (status === "error") return <div className="status-message error">Error Fetching data</div>;

    return (
        <div className="infinite-scroll-container">
            <h1 className="infinite-scroll-title">Infinite Scroll</h1>

            {data?.pages?.map((page, index) => (
                <ul key={index} className="user-list">
                    {page?.map((user) => (
                        <li key={user.id} className="user-list-item">
                            <img
                                src={user.avatar_url}
                                alt={user.login}
                                className="user-avatar"
                            />
                            <p className="user-name">{user.login}</p>
                        </li>
                    ))}
                </ul>
            ))}

            <div ref={ref} className="loader-status">
                {isFetchingNextPage
                    ? "Loading More..."
                    : hasNextPage // it decides from the getNextPageParam, if it returns some value, hasNextPage becomes true, if undefined then it becomes false
                        ? "Scroll down to load more"
                        : "No more users"}
            </div>
        </div>
    );
};