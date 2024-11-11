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
