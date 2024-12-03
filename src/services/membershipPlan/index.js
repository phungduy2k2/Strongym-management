export const getAllPlans = async () => {
    try {
        const res = await fetch("/api/membership-plan", {
            method: "GET",
            cache: "no-store",
        });
      
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getPlanById = async (id) => {
    try {
        const res = await fetch(`/api/membership-plan/${id}`, {
            method: "GET"
        })
    
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const addNewPlan = async(planData) => {
    try {
        const res = await fetch("/api/membership-plan", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData)
        });
    
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Error creating member:', err);
        throw err;
    }
}

export const updatePlan = async (id, planData) => {
    try {
        const res = await fetch(`/api/membership-plan/${id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        })
    
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(`Error updating membershipPlan with id ${id}:`, err);
        throw err;
    }
}

export const deletePlan = async (id) => {
    try {
        const res = await fetch(`/api/membership-plan/${id}`, {
          method: "DELETE"
        })
    
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(`Error deleting membershipPlan with id ${id}:`, err);
        throw err;
    }
}
