"use client";

// import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";

export const BlogContext = createContext(null);
// export const GlobalContext = createContext(null);

export const useBlogContext = () => useContext(BlogContext);

export function BlogProvider({ children, initialBlogs, initialEmployees }) {
  const [blogs, setBlogs] = useState(Array.isArray(initialBlogs) ? initialBlogs : [])
  const [employees, setEmployees] = useState(Array.isArray(initialEmployees) ? initialEmployees : [])

  return (
    <BlogContext.Provider value={{ blogs, setBlogs, employees, setEmployees }}>
      {children}
    </BlogContext.Provider>
  );
}
