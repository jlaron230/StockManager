import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Trop court!')
        .max(50, 'Trop long!')
        .required('Requis'),
    lastName: Yup.string()
        .min(2, 'Trop court!')
        .max(50, 'Trop long!')
        .required('Requis'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Le numéro doit contenir 10 chiffres')
        .required('Le numéro de téléphone est requis'),
    email: Yup.string()
        .email('Email invalide')
        .required('Requis'),
    acceptTerms: Yup.boolean()
        .oneOf([true], 'Vous devez accepter les conditions')
        .required('Requis'),
    nameEnterprise: Yup.string()
        .min(2, 'Nom trop court')
        .max(50, 'Nom trop long')
        .required('Requis'),
    country: Yup.string()
        .required('Requis'),
    address: Yup.string()
        .min(2, 'Adresse trop courte')
        .max(50, 'Adresse trop longue')
        .required('Requis'),
    city: Yup.string()
        .min(2, 'Nom trop court')
        .max(50, 'Nom trop long')
        .required('Requis'),
    postalCode: Yup.number()
        .typeError('Le code postal doit être un nombre')
        .positive('Le code postal doit être un nombre positif')
        .integer('Le code postal doit être un entier')
        .required('Requis'),
    password: Yup.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .max(50, 'Le mot de passe doit comporter moins de 50 caractères')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial')
        .required('Requis'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
        .required('Requis'),
});

const countries = [
    "France", "Brésil", "Japon", "Canada", "Australie",
    "Allemagne", "Italie", "Espagne", "Mexique", "Inde"
];

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

const Inscription = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Inscription</h1>

                    <Formik
                        initialValues={{
                            firstName: "",
                            lastName: "",
                            phone: "",
                            email: "",
                            acceptTerms: false,
                            nameEnterprise: "",
                            country: "",
                            address: "",
                            city: "",
                            postalCode: "",
                            password: "",
                            confirmPassword: ""
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => console.log(values)}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Prénom" name="firstName" placeholder="John" />
                                    <InputField label="Nom" name="lastName" placeholder="Doe" />
                                    <InputField label="Téléphone" name="phone" placeholder="0612345678" />
                                    <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
                                    <InputField label="Nom de l'entreprise" name="nameEnterprise" placeholder="Ma Société" />

                                    <div className="flex flex-col mb-4 relative">
                                        <label htmlFor="country" className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                            Pays <span className="text-red-700">*</span>
                                        </label>
                                        <Field
                                            as="select"
                                            id="country"
                                            name="country"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionnez un pays</option>
                                            {countries.map((c, i) => (
                                                <option key={i} value={c}>{c}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <InputField label="Adresse" name="address" placeholder="8 rue de la paix" />
                                    <InputField label="Ville" name="city" placeholder="Paris" />
                                    <InputField label="Code postal" name="postalCode" type="number" placeholder="75000" />
                                </div>

                                <InputField label="Mot de passe" name="password" type="password" placeholder="••••••••" />
                                <InputField label="Confirmation du mot de passe" name="confirmPassword" type="password" placeholder="••••••••" />

                                <div className="flex items-center">
                                    <Field type="checkbox" name="acceptTerms" id="acceptTerms" className="mr-2" />
                                    <label htmlFor="acceptTerms" className="text-sm text-gray-900 dark:text-white">
                                        J'accepte les conditions générales
                                    </label>
                                </div>
                                <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-sm mt-1" />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-white Primary-Color hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                                >
                                    {isSubmitting ? 'En cours...' : "S'inscrire"}
                                        </button>
                                        </Form>
                                        )}
                                </Formik>
                            </div>
                            </div>
                            </section>
                            );
                        };

                        export default Inscription;
