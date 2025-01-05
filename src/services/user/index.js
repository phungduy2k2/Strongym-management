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

// get User by userId, server action
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

// get User by employeeId, server action
// export const getUserByEmployeeId = async (id) => {
//   try {
//     const res = await fetch(`/api/user/clerk/${id}`, {
//       method: "GET"
//     })

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }

export const createClerkAccount = async (formData) => {
  try {
    const res = await fetch("/api/user/clerk", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json();    
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// export const deleteUser = async (id) => {
//   try {
//     const res = await fetch(`/api/user/${id}`, {
//       method: "DELETE"
//     })

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error(`Error deleting user with id ${id}:`, err);
//       throw err;
//   }
// }

// export const deleteClerkAcount = async (id) => {
//   try {
//     const res = await fetch(`/api/user/clerk/${id}`, {
//       method: "DELETE"
//     })

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error(`Error deleting clerk account with id ${id}:`, err);
//     throw err;
//   }
// }
