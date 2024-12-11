export const createMemberClass = async (formData) => {
  try {
    const res = await fetch("/api/member-class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error creating member:", err);
    throw err;
  }
};

//getMemberClassByMemberId
export const getClassesByMemberId = async (memberId) => {
  try {
    const res = await fetch(`/api/member-class/${memberId}`, {
      method: "GET"
    })

    const data = await res.json();
    return data;
  } catch(err) {
    console.error(err);
    throw err;
  }
}
