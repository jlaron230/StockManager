import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {Link, useNavigate} from "react-router-dom";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/16/solid";
import {useState} from "react";
import axios from "axios"; // Import axios

const SignupSchema = Yup.object().shape({
    prenom: Yup.string()
        .min(2, 'Trop court!')
        .max(50, 'Trop long!')
        .required('Requis'),
    nom: Yup.string()
        .min(2, 'Trop court!')
        .max(50, 'Trop long!')
        .required('Requis'),
    telephone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Le numéro doit contenir 10 chiffres')
        .required('Le numéro de téléphone est requis'),
    email: Yup.string()
        .email('Email invalide')
        .required('Requis'),
    acceptTerms: Yup.boolean()
        .oneOf([true], 'Vous devez accepter les conditions')
        .required('Requis'),
    entreprise: Yup.string()
        .min(2, 'Nom trop court')
        .max(50, 'Nom trop long')
        .required('Requis'),
    pays: Yup.string()
        .required('Requis'),
    adresse: Yup.string()
        .min(2, 'Adresse trop courte')
        .max(50, 'Adresse trop longue')
        .required('Requis'),
    ville: Yup.string()
        .min(2, 'Nom trop court')
        .max(50, 'Nom trop long')
        .required('Requis'),
    postal: Yup.number()
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

const InputField = ({
                        label,
                        name,
                        type = "text",
                        placeholder,
                        handleTogglePassword,
                        showPassword,
                        showPasswordField,
                    }) => (
    <div className="flex flex-col mb-4">
        <label
            htmlFor={name}
            className="mb-1 text-sm font-medium text-gray-900 dark:text-white"
        >
            {label} <span className="text-red-700">*</span>
        </label>

        <div className="relative">
            <Field
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10
          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
            />

            {showPasswordField && (
                <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={handleTogglePassword}
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                </div>
            )}
        </div>

        <ErrorMessage
            name={name}
            component="div"
            className="text-red-500 text-sm mt-1"
        />
    </div>
);

const Inscription = () => {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Inscription</h1>

                    <Formik
                        initialValues={{
                            prenom: '',
                            nom: '',
                            telephone: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            entreprise: '',
                            pays: '',
                            adresse: '',
                            ville: '',
                            postal: '',
                            role: 'undefined',
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
                            axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, values, {  headers: {
                                'Content-Type': 'application/json',
                            }})
                                .then((response) => {
                                    console.log("inscription réussi", response.data);
                                    setSubmitting(false);
                                    resetForm();
                                    navigate('/');
                                })
                                .catch(error => {
                                    console.error('Erreur lors de l\'inscription:', error, error.response?.data?.message);
                                    // Handle specific errors
                                    setFieldError('general',error.response?.data?.message || 'Échec de l\'inscription, veuillez réessayer');
                                })
                                .finally(() => {
                                    setSubmitting(false); // Stop form submission
                                });
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className="space-y-4 mb-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Prénom" name="prenom" placeholder="John"/>
                                    <InputField label="Nom" name="nom" placeholder="Doe"/>
                                    <InputField label="Téléphone" name="telephone" placeholder="0612345678"/>
                                    <InputField label="Email" name="email" type="email" placeholder="name@company.com"/>
                                    <InputField label="Nom de l'entreprise" name="entreprise"
                                                placeholder="Ma Société"/>

                                    <div className="flex flex-col mb-4 relative">
                                        <label htmlFor="country"
                                               className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                            Pays <span className="text-red-700">*</span>
                                        </label>
                                        <Field
                                            as="select"
                                            id="country"
                                            name="pays"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Sélectionnez un pays</option>
                                            {countries.map((c, i) => (
                                                <option key={i} value={c}>{c}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="pays" component="div"
                                                      className="text-red-500 text-sm mt-1"/>
                                    </div>

                                    <InputField label="Adresse" name="adresse" placeholder="8 rue de la paix"/>
                                    <InputField label="Ville" name="ville" placeholder="Paris"/>
                                    <InputField label="Code postal" name="postal" type="number"
                                                placeholder="75000"/>
                                </div>

                                <InputField label="Mot de passe" name="password" showPasswordField="true" showPassword={showPassword} handleTogglePassword={handleTogglePassword}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Taper un mot de passe"/>
                                <InputField label="Confirmation du mot de passe" showPasswordField="true" showPassword={showPassword} handleTogglePassword={handleTogglePassword} name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Retaper le mot de passe"/>

                                <div className="flex items-center justify-center m-7">
                                    <Field type="checkbox" name="acceptTerms" id="acceptTerms" className="mr-2"/>
                                    <label htmlFor="acceptTerms" className=" text-sm text-gray-900 dark:text-white">
                                        <Link className="text-color underline" to="/condition-general-utilisation"  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        >J'accepte les termes et conditions d'utilisation</Link> <span
                                        className="text-red-700">*</span>
                                    </label>
                                </div>
                                <ErrorMessage name="acceptTerms" component="div" className="flex items-center justify-center text-red-500 text-sm mt-1"/>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="max-md:w-full md:w-1/2 flex justify-center m-auto text-white Primary-Color hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                                >
                                    {isSubmitting ? 'En cours...' : "S'inscrire"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <div className="border-b-4 text-gray-300 mr-auto ml-auto flex w-1/4 mb-10">
                    </div>
                    <div className="flex justify-center mb-3">
                        <p>Vous avez déjà un compte ? <Link className="text-color"
                                                                    to="/connexion"  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >Se connecter</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Inscription;
