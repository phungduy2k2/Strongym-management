export const getEmployees = async () => {
  try {
    const res = await fetch("/api/employee", {
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

export const getEmployeeById = async (id) => {
  try {
    const res = await fetch(`/api/employee/${id}`, {
      method: "GET",
    });

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const res = await fetch("/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error creating employee:", err);
    throw err;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const res = await fetch(`/api/employee/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error updating employee with id ${id}:`, err);
    throw err;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const res = await fetch(`/api/employee/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error deleting employee with id ${id}:`, err);
    throw err;
  }
};
