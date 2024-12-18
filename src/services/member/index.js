export const getMembers = async () => {
  try {
    const res = await fetch("/api/member", {
      method: "GET",
    });
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getMemberById = async (id) => {
  try {
    const res = await fetch(`/api/member/${id}`, {
      method: "GET"
    })

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const createMember = async (memberData) => {
  try {
    const res = await fetch("/api/member", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData)
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error creating member:', err);
    throw err;
  }
}

export const updateMember = async (id, memberData) => {
  try {
    const res = await fetch(`/api/member/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    })

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error updating member with id ${id}:`, err);
    throw err;
  }
}

export const deleteMember = async (id) => {
  try {
    const res = await fetch(`/api/member/${id}`, {
      method: "DELETE"
    })

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error deleting member with id ${id}:`, err);
      throw err;
  }
}
