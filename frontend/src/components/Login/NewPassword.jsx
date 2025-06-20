import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {useNavigate} from "react-router-dom";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/16/solid";
import {useState} from "react";

// Schéma de validation pour les champs password et confirmPassword avec Yup
const SignupSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .max(50, 'Le mot de passe doit comporter moins de 50 caractères')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial')
        .required('Requis'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
        .required('Requis'),
});

// Composant personnalisé pour afficher un champ de formulaire avec label, input et message d'erreur
// Inclut aussi un bouton pour afficher/masquer le mot de passe (icône œil)
const InputField = ({ label, name, type = "text", placeholder, handleTogglePassword, showPassword }) => (
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
        {/* Bouton affichage/masquage mot de passe */}
        <div
            className="pt-3 pb-3 absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={handleTogglePassword}
        >
            {showPassword ? (
                <EyeSlashIcon className="h-6 w-6"/>
            ) : (
                <EyeIcon className="h-6 w-6"/>
            )}
        </div>
        {/* Message d'erreur lié au champ */}
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1"/>
    </div>
);

// Composant principal pour définir un nouveau mot de passe
const NewPassword = () => {
    // Etat pour gérer l'affichage ou non du mot de passe
    const [showPassword, setShowPassword] = useState(false);

    // Hook pour naviguer vers une autre page après soumission
    const navigate = useNavigate();

    // Fonction pour basculer l'état d'affichage du mot de passe
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            {/* Conteneur principal centré avec style */}
            <div
                className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
                <div className="p-6 space-y-6">
                    {/* Titre */}
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Définir un nouveau mot de passe</h1>
                    <p>Choisissez un nouveau mot de passe fort !</p>

                    {/* Formulaire géré avec Formik */}
                    <Formik
                        initialValues={{ password: "", confirmPassword: "" }}
                        validationSchema={SignupSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            console.log(values); // Affiche les valeurs dans la console
                            setSubmitting(false); // Termine l'état de soumission
                            navigate('/'); // Redirige vers la page d'accueil
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className="space-y-4 mb-10">
                                {/* Champ mot de passe avec gestion affichage/masquage */}
                                <InputField label="Mot de passe" name="password" showPassword={showPassword} handleTogglePassword={handleTogglePassword}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Taper un mot de passe"/>
                                {/* Champ confirmation mot de passe */}
                                <InputField label="Confirmation du mot de passe" showPassword={showPassword} handleTogglePassword={handleTogglePassword} name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Retaper le mot de passe"/>
                                {/* Bouton de soumission désactivé pendant l'envoi */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-7 max-md:w-full md:w-1/2 flex justify-center m-auto text-white Primary-Color hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                                >
                                    {isSubmitting ? `En cours...` : "Envoyer"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default NewPassword;
