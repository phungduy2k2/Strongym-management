export const getClasses = async () => {
  try {
    const res = await fetch("/api/class", {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getClassById = async (id) => {
  try {
    const res = await fetch(`/api/class/${id}`, {
      method: "GET",
    });

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createClass = async (classData) => {
  try {
    const response = await fetch("/api/class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating class:", err);
    throw err;
  }
};

export const updateClass = async (id, classData) => {
  try {
    const response = await fetch(`/api/class/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error updating class with id ${id}:`, err);
    throw err;
  }
};

export const deleteClass = async (id) => {
  try {
    const response = await fetch(`/api/class/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error deleting class with id ${id}:`, err);
    throw err;
  }
};
