import * as yup from "yup";

export const CheckoutSchemaValidation = yup.object().shape({
    fullname: yup
        .string()
        .required("Full name is required")
        .min(3, "Enter a valid full name"),

    phone: yup
        .string()
        .matches(/^\d{8,15}$/, "Enter a valid phone number")
        .required("Phone number is required"),

    address: yup
        .string()
        .required("Address is required")
        .min(5, "Enter a more detailed address"),

    city: yup
        .string()
        .required("City is required")
        .min(2, "Enter a valid city name"),

    notes: yup.string().optional()
});
