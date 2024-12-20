export const createPayment = async (formData) => {
  try {
    const res = await fetch(`/api/payment`, {
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
    throw err;
  }
};

export const getPayments = async () => {
  try {
    const res = await fetch("/api/payment", {
      method: "GET",
    })

    const data = await res.json();
    return data;
  } catch(err) {
    console.error(err);
    throw err;
  }
}
