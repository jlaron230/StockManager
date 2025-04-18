import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'le numéro doit contenir des caractères numérique')
        .required('Phone number is required'),
    email: Yup.string().email('Invalid email').required('Required'),
    acceptTerms: Yup.boolean()
        .oneOf([true], 'Vous devez accepter les conditions')
        .required('Requis'),
    message: Yup.string().min(10, 'Message trop court').required('Veuillez saisir un message'),
});


const Footer = () => {
    return (
        <>
            <footer>
                <Formik
                    initialValues = {{
                        firstName: "",
                        lastName: "",
                        email: "",
                        acceptTerms: false,
                        phone: "",
                        message: ""
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(values) => {
                            console.log(values)
                    }}
                >
                    {({
                          isSubmitting
                          /* and other goodies */
                      }) => (
                        <Form className="max-w-md mx-auto">
                            <div className="flex flex-wrap gap-4">
                                <div className="mb-5">
                                    <label htmlFor="firstName"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Prénom</label>
                                    <Field
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="john" required/>
                                </div>
                                <ErrorMessage name="firstName"/>
                                <div className="mb-5">
                                    <label htmlFor="lastName"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Nom</label>
                                    <Field
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="doe" required/>
                                </div>
                                <ErrorMessage name="lastName"/>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="mb-5">
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                        email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@flowbite.com" required/>
                                </div>
                                <ErrorMessage name="email"/>
                                <div className="mb-5 max-w-44">
                                    <label htmlFor="phone"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Téléphone</label>
                                    <Field
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="+33 612500" required/>
                                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1"/>
                                </div>
                            </div>
                            <div className="mb-5">
                                <Field as="textarea"
                                       name="message"

                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Votre message" required/>
                            </div>
                            <ErrorMessage name="message"/>
                            <div className="flex items-start mb-5">
                                <div className="flex items-center h-5">
                                    <Field name="acceptTerms" type="checkbox"
                                           className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                           required/>
                                    <ErrorMessage name="acceptTerms"/>
                                </div>
                                <label
                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Accepter la
                                    politique de confidentialité</label>
                            </div>
                            <button type="submit" disabled={isSubmitting}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
                            </button>
                        </Form>
                    )}
                </Formik>

            </footer>
        </>
    )
}
export default Footer;