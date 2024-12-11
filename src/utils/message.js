export const messages = {
    /// authen
    login: {
        SUCCESS: "Đăng nhập thành công!",
        USER_NOT_FOUND: "Không tìm thấy tài khoản này.",
        INCORRECT_PASSWORD: "Sai mật khẩu. Xin thử lại.",
        ERROR: "Có lỗi xảy ra khi đăng nhập. Xin thử lại."
    },
    register: {
        SUCCESS: "Tạo tài khoản thành công!",
        EMAIL_EXIST: "Email này đã được sử dụng. Vui lòng dùng email khác.",
        ERROR: "Có lỗi xảy ra khi đăng ký. Xin thử lại."
    },

    /// user
    getUserById: {
        USER_NOT_FOUND: "Không tìm thấy người dùng này.",
        ERROR: "Có lỗi xảy ra khi tìm thông tin người dùng này."
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
        ERROR: "Cập nhật thành viên thất bại. Xin thử lại."
    },
    deleteMember: {
        SUCCESS: "Xóa thành viên thành công!",
        NOT_FOUND: "Không tìm thấy thành viên để xóa.",
        ERROR: "Có lỗi khi xóa thành viên. Xin thử lại.",
    },

    /// equipment
    addEquipment: {
        SUCCESS: "Thêm thiết bị thành công!",
        ERROR: "Có lỗi khi thêm thiết bị. Xin thử lại."
    },
    getAllEquipment: {
        NOT_FOUND: "Không tìm thấy thiết bị.",
        ERROR: "Có lỗi khi tìm thiết bị. Xin thử lại."
    },
    getEquipmentById: {
        NOT_FOUND: "Không tìm thấy thiết bị.",
        ERROR: "Có lỗi khi tìm thiết bị. Xin thử lại"
    },
    updateEquipment: {
        SUCCESS: "Cập nhật thiết bị thành công!",
        NOT_FOUND: "Không tìm thấy thiết bị này.",
        ERROR: "Có lỗi khi cập nhật thiết bị. Xin thử lại."
    },
    deleteEquipment: {
        SUCCESS: "Xóa thiết bị thành công!",
        NOT_FOUND: "Không tìm thấy thiết bị này.",
        ERROR: "Có lỗi khi xóa thiết bị. Xin thử lại.",
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
    getEmployeeById: {
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
    getAllBlog: {
        ERROR: "Có lỗi khi lấy dữ liệu bài viết. Xin thử lại."
    },
    addBlog: {
        SUCCESS: "Thêm bài viết thành công!",
        BLOG_EXIST: "Đã tồn tại bài viết này.",
        ERROR: "Có lỗi khi thêm bài viết. Xin thử lại."
    },
    getBlogById: {
        NOT_FOUND: "Không tìm thấy bài viết.",
        ERROR: "Có lỗi khi tìm bài viết này. Xin thử lại."
    },
    updateBlog: {
        NOT_FOUND: "Không tìm thấy bài viết.",
        SUCCESS: "Cập nhật bài viết thành công!",
        ERROR: "Có lỗi khi cập nhật bài viết. Xin thử lại."
    },
    deleteBlog: {
        NOT_FOUND: "Không tìm thấy bài viết.",
        SUCCESS: "Xóa bài viết thành công!",
        ERROR: "Có lỗi khi xóa bài viết. Xin thử lại."
    },

    /// class
    addClass: {
        SUCCESS: "Thêm lớp học thành công!",
        CLASS_EXIST : "Lớp này đã được tạo.",
        ERROR: "Có lỗi khi thêm lớp học. Xin thử lại."
    },
    getAllClass: {
        ERROR: "Có lỗi khi lấy dữ liệu lớp học. Xin thử lại."
    },
    getClassById: {
        NOT_FOUND: "Không tìm thấy lớp học.",
        ERROR: "Có lỗi khi tìm lớp học. Xin thử lại."
    },
    updateClass: {
        NOT_FOUND: "Không tìm thấy lớp học.",
        SUCCESS: "Cập nhật lớp học thành công!",
        ERROR: "Có lỗi khi cập nhật lớp học. Xin thử lại."
    },
    deleteClass: {
        NOT_FOUND: "Không tìm thấy lớp học.",
        SUCCESS: "Xóa lớp học thành công!",
        ERROR: "Có lỗi khi xóa lớp học. Xin thử lại.",
    },

    /// event
    addEvent: {
        SUCCESS: "Thêm sự kiện thành công!",
        ERROR: "Có lỗi khi thêm sự kiện. Xin thử lại."
    },
    getActiveEvent: {
        NOT_FOUND: "Không tìm thấy sự kiện.",
        ERROR: "Có lỗi khi tìm sự kiện. Xin thử lại."
    },
    getEventById: {
        NOT_FOUND: "Không tìm thấy sự kiện này.",
        ERROR: "Có lỗi khi tìm sự kiện này. Xin thử lại."
    },
    updateEvent: {
        NOT_FOUND: "Không tìm thấy sự kiện.",
        SUCCESS: "Cập nhật sự kiện thành công!",
        ERROR: "Có lỗi khi cập nhật sự kiện. Xin thử lại."
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
    },

    /// payment
    createPayment: {
        SUCCESS: "Tạo khoản thanh toán thành công!",
        ERROR: "Có lỗi khi tạo khoản thanh toán. Xin thử lại."
    },

    /// member-class
    createMemberClass: {
        SUCCESS: "Đăng ký lớp thành công!",
        ERROR: "Đăng ký lớp thất bại. Xin thử lại."
    },
    getAllMemberClass: {
        ERROR: "Có lỗi khi lấy thông tin thành viên lớp học. Xin thử lại."
    },
    getMemberClassByMemberId: {
        NOT_FOUND: "Bạn không tham gia lớp học nào.",
        ERROR: "Có lỗi khi tìm lớp học của bạn."
    }
}

export const dialogMessages = {
    class: {
        ADD_TITLE: "Thêm mới lớp học",
        DETAILS_TITLE: "Chi tiết lớp học",
        NAME: "Tên lớp",
        TRAINER: "Giáo viên",
        PRICE: "Giá",
        CURRENCY: "Đơn vị tiền",
        DESCRIPTION: "Mô tả",
        START_DATE: "Ngày bắt đầu",
        END_DATE: "Ngày kết thúc",
        SAVE_CHANGE: "Lưu thay đổi",
        SAVE_BUTTON: "Lưu lớp học",
        DELETE_BUTTON: "Xóa lớp học",
        REGISTER_BUTTON: "Đăng ký lớp",
        ALERT_DIALOG_TITLE: "Bạn có chắc muốn xóa lớp học này?",
        ALERT_DIALOG_DESCRIPTION: "Hành động này không thể hoàn tác. Nó sẽ xóa vĩnh viễn lớp học.",
        DELETE: "Xóa",
        CANCEL: "Hủy",
    }
}

export const modalMessages = {
    addMember: {
        TITLE: "Thêm mới thành viên",
        IMAGE: "Ảnh",
        NAME: "Họ và tên",
        BIRTH: "Ngày sinh",
        GENDER: "Giới tính",
        GENDER_PLACEHOLDER: "Chọn giới tính",
        PHONE: "Số điện thoại",
        ADDRESS: "Địa chỉ",
        MEMBERSHIP_PLAN: "Gói tập đăng ký",
        MEMBERSHIP_PLACEHOLDER: "Chọn gói tập",
        EXPIRED_DATE: "Ngày hết hạn",
        STATUS: "Trạng thái",
        STATUS_PLACEHOLDER: "Chọn trạng thái",
        SAVE: "Lưu",
    }
}
