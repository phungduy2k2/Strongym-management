export const messages = {
    /// authen
    login: {
        SUCCESS: "Login successfully!",
        USER_NOT_FOUND: "Account not found with this email.",
        INCORRECT_PASSWORD: "Incorrect password. Please try again!",
        ERROR: "Something went wrong ! Please try again."
    },
    register: {
        SUCCESS: "Account created successfully!",
        EMAIL_EXIST: "Email is already exist. Please try with different email.",
        ERROR: "Something went wrong! Please try again."
    },

    /// member
    addMember: {
        SUCCESS: "Add new member successfully!",
        MEMBER_EXIST: "This phone is already used. Please try with different phone number.",
        ERROR: "Failed to add new member. Please try again."
    },
    updateMember: {
        SUCCESS: "Update member successfully!",
        ERROR: "Failed to update member. Please try again."
    },
    getAllMember: {
        NO_FOUND: "No member found",
        ERROR: "Failed to get members. Please try again."
    },
    deleteMember: {
        SUCCESS: "Delete member successfully!",
        NO_ID: "Member ID is required.",
        ERROR: "Failed to delete member. Please try again.",
    },

    /// equipment
    addEquipment: {
        SUCCESS: "Add new equipment successfully!",
        ERROR: "Failed to add new equipment. Please try again."
    },
    getAllEquipment: {
        ERROR: "Failed to get equipments. Please try again."
    },
    updateEquipment: {
        SUCCESS: "Update equipment successfully!",
        ERROR: "Failed to update equipment. Please try again."
    },
    deleteEquipment: {
        SUCCESS: "Delete equipment successfully!",
        NO_ID: "Equipment ID is required.",
        ERROR: "Failed to delete equipment. Please try again.",
    },

    /// employee
    addEmployee: {
        SUCCESS: "Add new employee successfully!",
        EMPLOYEE_EXIST: "This ID number is already used. Please try with different ID number.",
        ERROR: "Failed to add new employee. Please try again."
    },
    getAllEmployee: {
        NO_FOUND: "No employee found.",
        ERROR: "Failed to get employees. Please try again."
    },
    searchEmployee: {
        SUCCESS: "Search for employees successfully.",
        NO_SEARCH: "Please enter name or phone number.",
        NO_FOUND: "No employee found.",
        ERROR: "Failed to find employee. Please try again."
    },
    updateEmployee: {
        SUCCESS: "Update employee successfully!",
        ERROR: "Failed to update employee. Please try again."
    },
    deleteEmployee: {
        SUCCESS: "Delete employee successfully!",
        NO_ID: "Employee ID is required.",
        ERROR: "Failed to delete employee. Please try again.",
    },

    /// blog
    addBlog: {
        SUCCESS: "Add new blog successfully!",
        BLOG_EXIST: "This blog is already created.",
        ERROR: "Failed to add new blog. Please try again."
    },
    blogByCategory: {
        SUCCESS: "Blogs fetched successfully",
        NO_CATEGORY: "Category is required for search.",
        NO_FOUND: "No blogs found.",
        ERROR: "Failed to find blogs. Please try again."
    },
    updateBlog: {
        SUCCESS: "Update blog successfully!",
        ERROR: "Failed to update blog. Please try again."
    },

    /// class
    addClass: {
        SUCCESS: "Add new class successfully!",
        CLASS_EXIST : "This class is already created.",
        ERROR: "Failed to add new blog. Please try again."
    },
    updateClass: {
        SUCCESS: "Update class successfully!",
        ERROR: "Failed to update class. Please try again."
    },
    deleteClass: {
        SUCCESS: "Delete class successfully!",
        NO_ID: "Class ID is required.",
        ERROR: "Failed to delete class. Please try again.",
    },

    /// event
    addEvent: {
        SUCCESS: "Add new event successfully!",
        ERROR: "Failed to add new event. Please try again."
    },
    activeEvent: {
        ERROR: "Failed to fetch events. Please try again."
    },
    updateEvent: {
        SUCCESS: "Update event successfully!",
        ERROR: "Failed to update event. Please try again."
    }
}