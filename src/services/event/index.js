export const getAllEvents = async () => {
    try {
        const res = await fetch("/api/event", {
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

export const getEventById = async (id) => {
    try {
        const res = await fetch(`/api/event/${id}`, {
            method: "GET"
        })
    
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const createEvent = async (eventData) => {
    try {
        const response = await fetch("/api/event", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error creating event:', err);
        throw err;
    }
}

export const updateEvent = async (id, eventData) => {
    try {
        const response = await fetch(`/api/event/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error updating event with id ${id}:`, err);
        throw err;
    }
}

export const deleteEvent = async (id) => {
    try {
        const response = await fetch(`/api/event/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error deleting event with id ${id}:`, err);
        throw err;
    }
}
