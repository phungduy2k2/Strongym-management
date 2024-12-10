export const createUser = async (formData) => {
  try {
    const res = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

// get User by ID, server action
export const getUserById = async (id) => {
  try {
    const res = await fetch(`${process.env.URL}/api/user/${id}`, {
      method: "GET"
    })

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
