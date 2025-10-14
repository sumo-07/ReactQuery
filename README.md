# ReactQuery Demo / Sample

This repository demonstrates usage of **React Query (TanStack Query)** in a React + Vite setup, including features like:

- Basic queries (`useQuery`)
- Mutations for delete / update
- Pagination & infinite scroll (`useInfiniteQuery`)
- Intersection Observer for scroll-based loading
- Cache updates and optimistic UI updates

---

## 📁 Project Structure

```

/public
/src
/api
api.js            # API functions: fetchPosts, deletePost, updatePost, fetchUsers
/components or pages
FetchRQ.jsx       # Example with pagination + mutations
InfiniteScroll.jsx  # Infinite scroll example
index.jsx            # App entry
App.jsx               # Routing / layout
.gitignore
package.json
vite.config.js
README.md

```

---

## 🛠 Technology Stack

- React (with functional components and hooks)  
- Vite for fast bundling  
- TanStack Query (React Query vX) for data fetching, caching, mutation  
- react-intersection-observer for detecting scroll visibility  
- Axios (or fetch) for API calls  
- CSS / basic styling  

---

## 🚀 Features & Examples

### 1. Pagination + Mutations (FetchRQ)

- Fetch a list of posts via `useQuery` with parameters: `pageNumber`, `filter`  
- Use `useMutation` for deleting and updating posts  
- After a successful mutation, update React Query cache via `queryClient.setQueryData(...)` to reflect changes immediately  
- Uses `keepPreviousData` (or placeholder data) to avoid flicker between pages  

### 2. Infinite Scroll (InfiniteScroll)

- Use `useInfiniteQuery` to fetch pages lazily  
- Specify `getNextPageParam` to tell React Query how to load next pages  
- Use `react-intersection-observer` (`useInView`) to detect when the bottom element is in view  
- Trigger `fetchNextPage()` inside an effect when the observed div becomes visible  
- Render all pages in sequence and show a sentinel “loading / no more data” message  

---

## 🧭 How It Works (Flow Summary)

1. On mount, React Query calls `fetchUsers({ pageParam: 1 })` (due to default)  
2. API returns data; `getNextPageParam` is used to compute next page number  
3. `data.pages` accumulates pages on each fetch  
4. Intersection Observer watches a DOM node; when you scroll near it, `inView` becomes `true`  
5. `useEffect` sees `inView && hasNextPage` → triggers `fetchNextPage()` → fetches next page  
6. When `getNextPageParam` returns `undefined`, React Query stops further fetching  

---

## 🧩 How to Run Locally

1. Clone this repo  
```

git clone [https://github.com/sumo-07/ReactQuery.git](https://github.com/sumo-07/ReactQuery.git)
cd ReactQuery

```
2. Install dependencies  
```

npm install

```
3. Run dev server  
```

npm run dev

```
4. Open browser at `http://localhost:3000` (or the URL shown).  
5. Explore pages & infinite scroll, try delete/update (if backend supports), and see console logs.

---

## 📚 References

- [React Query docs](https://tanstack.com/query/latest)  
- [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer)  
- [Axios documentation](https://axios-http.com/)  

---
