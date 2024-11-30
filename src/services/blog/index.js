export const getAllBlogs = async () => {
    try {
        const res = await fetch("/api/blog", {
            method: "GET",
            cache: "no-store"
        })

        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getBlogById = async (id) => {
    try {
        const res = await fetch(`/api/blog/${id}`, {
            method: "GET"
        })
    
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const createBlog = async (blogData) => {
    try {
        const response = await fetch("/api/blog", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blogData),
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error creating blog:', err);
        throw err;
    }
}

export const updateBlog = async (id, blogData) => {
    try {
        const response = await fetch(`/api/blog/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(blogData),
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error updating blog with id ${id}:`, err);
        throw err;
    }
}

export const deleteBlog = async (id) => {
    try {
        const response = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error deleting blog with id ${id}:`, err);
        throw err;
    }
}
