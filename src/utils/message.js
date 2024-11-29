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
        SUCCESS: "Thêm thành viên mới thành công!",
        MEMBER_EXIST: "Số điện thoại này đã được sử dụng. Vui lòng sử dụng số khác.",
        ERROR: "Có lỗi khi thêm thành viên. Xin thử lại"
    },
    getAllMember: {
        NO_FOUND: "Không có thành viên được tìm thấy.",
        ERROR: "Có lỗi khi lấy danh sách thành viên. Xin thử lại."
    },
    getAMember: {
        NOT_FOUND: "Không tìm thấy thành viên.",
        ERROR: "Có lỗi khi tìm thành viên này. Xin thử lại."
    },
    updateMember: {
        NOT_FOUND: "Không tìm thấy thành viên.",
        SUCCESS: "Cập nhật thành viên thành công!",
        ERROR: "Cập nhật thất bại. Xin thử lại."
    },
    deleteMember: {
        SUCCESS: "Xóa thành viên thành công!",
        NOT_FOUND: "Không tìm thấy thành viên để xóa.",
        ERROR: "Có lỗi khi xóa thành viên. Xin thử lại.",
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
        SUCCESS: "Thêm nhân viên mới thành công!",
        EMPLOYEE_EXIST: "Nhân viên này đã tồn tại.",
        ERROR: "Có lỗi khi thêm nhân viên mới. Xin thử lại."
    },
    getAllEmployee: {
        ERROR: "Có lỗi khi tìm nhân viên. Xin thử lại."
    },
    searchEmployee: {
        SUCCESS: "Search for employees successfully.",
        NO_SEARCH: "Please enter name or phone number.",
        NOT_FOUND: "Không tìm thấy nhân viên.",
        ERROR: "Có lỗi khi tìm nhân viên này. Xin thử lại."
    },
    updateEmployee: {
        SUCCESS: "Cập nhật nhân viên thành công!",
        NOT_FOUND: "Không tìm thấy nhân viên.",
        ERROR: "Có lỗi khi cập nhật nhân viên. Xin thử lại."
    },
    deleteEmployee: {
        SUCCESS: "Xóa nhân viên thành công!",
        NOT_FOUND: "Không tìm thấy nhân viên.",
        ERROR: "Có lỗi khi xóa nhân viên. Xin thử lại.",
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
    },

    /// membershipPlan
    getAllPlans: {
        ERROR: "Có lỗi khi lấy dữ liệu gói tập. Xin thử lại."
    },
    addPlan: {
        PLAN_EXIST: "Gói tập đã tồn tại.",
        SUCCESS: "Thêm gói tập thành công!",
        ERROR: "Có lỗi khi thêm gói tập. Xin thử lại.",
    },
    getPlanById: {
        NOT_FOUND: "Không tìm thấy gói tập.",
        ERROR: "Có lỗi khi lấy dữ liệu gói tập này. Xin thử lại.",
    },
    updatePlan: {
        NOT_FOUND: "Không tìm thấy gói tập.",
        SUCCESS: "Cập nhật gói tập thành công!",
        ERROR: "Có lỗi khi cập nhật gói tập. Xin thử lại."
    },
    deletePlan: {
        NOT_FOUND: "Không tìm thấy gói tập.",
        SUCCESS: "Xóa gói tập thành công!",
        ERROR: "Có lỗi khi xóa gói tập. Xin thử lại."
    }
}