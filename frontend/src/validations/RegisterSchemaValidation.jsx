import * as yup from "yup";

export const RegisterSchemaValidation = yup.object().shape({
    username: yup
        .string()
        .required("Username is required")
        .min(3, "Minimum 3 characters required"),

    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),

    phone: yup
        .string()
        .matches(/^\d{8,15}$/, "Enter a valid phone number")
        .required("Phone number is required"),

    age: yup
        .number()
        .typeError("Age must be a number")
        .min(10, "Minimum age is 10")
        .max(100, "Maximum age is 100")
        .required("Age is required"),

    password: yup
        .string()
        .required("Password is required")
        .min(6, "Minimum 6 characters required"),
});
