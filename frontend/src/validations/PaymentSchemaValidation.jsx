import * as yup from "yup";

export const PaymentSchemaValidation = yup.object({
  method: yup.string().required(),

  cardNum: yup.string().when("method", {
    is: "card",
    then: (schema) =>
      schema
        .required("Card number is required")
        .matches(/^[0-9]{16}$/, "Must be 16 digits"),
  }),

  cardName: yup.string().when("method", {
    is: "card",
    then: (schema) =>
      schema.required("Name on card is required"),
  }),

  expiry: yup.string().when("method", {
    is: "card",
    then: (schema) =>
      schema
        .required("Expiry date is required")
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  }),

  cvv: yup.string().when("method", {
    is: "card",
    then: (schema) =>
      schema
        .required("CVV is required")
        .matches(/^[0-9]{3}$/, "Must be 3 digits"),
  }),
});
