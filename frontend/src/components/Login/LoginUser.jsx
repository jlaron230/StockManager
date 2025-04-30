import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

const SignupSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email invalide')
        .required('Requis'),
    password: Yup.string()
        .required('Requis'),
});

const InputField = ({ label, name, type = "text", placeholder }) => (
    <div className="flex flex-col mb-4 relative">
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
            {label} <span className="text-red-700">*</span>
        </label>
        <Field
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
        />
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
);

const LoginUser = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Connexion</h1>

                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => console.log(values)}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div className=" grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
                                </div>

                                <InputField label="Mot de passe" name="password" type="password" placeholder="••••••••" />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-white Primary-Color hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                                >
                                    {isSubmitting ? 'En cours...' : "Connexion"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default LoginUser;
