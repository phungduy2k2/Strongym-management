export const getAllMembers = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/member", {
      method: "GET",
      cache: "no-store",
    });
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
