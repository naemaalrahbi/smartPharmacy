import * as yup from 'yup';

export const LoginSchemaValidation = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email required'),
    password: yup.string().required('Password required')
});
