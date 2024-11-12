import { toast } from "react-toastify";

export const showToast = (type, message) => {
  const position = {
    position: "bottom-right"
  }

  if (type === "success") toast.success(message, position);
  else if (type === "error") toast.error(message, position);
}

export const registrationFormControls = [
  {
    id: "username",
    type: "text",
    placeholder: "Enter your username",
    label: "Username",
    componentType: "input",
  },
  {
    id: "password",
    type: "password",
    placeholder: "Enter your password",
    label: "Password",
    componentType: "input",
  },
  {
    id: "passwordConfirm",
    type: "password",
    placeholder: "Confirm password",
    label: "Password confirm",
    componentType: "input",
  },
  {
    id: "role",
    type: "",
    placeholder: "",
    label: "Role",
    componentType: "select",
    options: [
      {
        id: "manager",
        label: "Manager",
      },
      {
        id: "member",
        label: "Member",
      },
    ],
  },
];

export const loginFormControls = [
  {
    id: "username",
    type: "text",
    placeholder: "Enter your username",
    label: "Username",
    componentType: "input",
  },
  {
    id: "password",
    type: "password",
    placeholder: "Enter your password",
    label: "Password",
    componentType: "input",
  },
];
