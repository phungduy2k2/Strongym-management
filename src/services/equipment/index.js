export const getEquipments = async () => {
    try {
        const res = await fetch("/api/equipment", {
            method: "GET",
            cache: "no-store"
        })

        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getEquipmentById = async (id) => {
    try {
        const res = await fetch(`/api/equipment/${id}`, {
            method: "GET"
        })
    
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const createEquipment = async (equipmentData) => {
    try {
        const response = await fetch("/api/equipment", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipmentData),
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error creating equipment:', err);
        throw err;
    }
}

export const updateEquipment = async (id, equipmentData) => {
    try {
        const response = await fetch(`/api/equipment/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(equipmentData),
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error updating equipment with id ${id}:`, err);
        throw err;
    }
}

export const deleteEquipment = async (id) => {
    try {
        const response = await fetch(`/api/equipment/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error deleting equipment with id ${id}:`, err);
        throw err;
    }
}
