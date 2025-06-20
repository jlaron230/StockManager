import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/16/solid";
import {useEffect, useState} from "react";
import axios from "axios";

// Schéma de validation avec Yup
const SignupSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email invalide')
        .required('Requis'),
    password: Yup.string()
        .required('Requis'),
});

// Composant réutilisable pour un champ de formulaire avec label, erreur et toggle visibilité mot de passe
const InputField = ({
                        label,
                        name,
                        type = "text",
                        placeholder,
                        handleTogglePassword,
                        showPassword,
                        showPasswordField,
                    }) => (
    <div className="flex flex-col mb-4 relative">
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

            {/* Icone pour afficher/cacher le mot de passe */}
            {showPasswordField && (
                <div
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={handleTogglePassword}
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                    ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
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

// Composant principal LoginUser
const LoginUser = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    // Toggle affichage du mot de passe
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // useEffect pour récupérer le token CSRF au chargement
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const tokenResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/form-token`, {
                    withCredentials: true,
                });
                console.log("✅ Token reçu :", tokenResponse.data.csrfToken);
                setToken(tokenResponse.data.csrfToken);
            } catch (error) {
                console.error("❌ Erreur récupération CSRF:", error);
            }
        };

        fetchToken();
    }, []);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <div
                className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Connexion</h1>

                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                            last_login: "",
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, values, {
                                headers: { "x-csrf-token": token },
                                withCredentials: true,
                            })
                                .then(res => {
                                    const data = res.data;
                                    console.log(data);
                                    navigate('/');
                                })
                                .catch(error => {
                                    console.error('Erreur lors de la connexion:', error);
                                    // Gestion des erreurs personnalisée
                                    setFieldError('general', 'Échec de la connexion, vérifiez vos identifiants');
                                })
                                .finally(() => {
                                    setSubmitting(false); // Fin de la soumission
                                });
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className="space-y-4 mb-10">
                                <div className=" grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Email" name="email" type="email" placeholder="name@company.com"/>
                                </div>

                                <div className=" grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                                    <InputField label="Mot de passe" name="password" showPasswordField={true} showPassword={showPassword} handleTogglePassword={handleTogglePassword}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Taper un mot de passe"/>
                                    <div className="flex justify-start mb-3">
                                        <Link className="text-color" to="/password-forgot" onClick={() => window.scrollTo({
                                            top: 0, behavior: 'smooth'
                                        })}>
                                            Mot de passe oublié ?
                                        </Link>
                                        <ErrorMessage name="general" component="div" className="text-red-500 text-sm mt-1 text-center" />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="max-md:w-full md:w-1/2 flex justify-center m-auto text-white Primary-Color hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                                >
                                    {isSubmitting ? 'En cours...' : "Connexion"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <div className="border-b-4 text-gray-300 mr-auto ml-auto flex w-1/4 mb-10">
                    </div>
                    <div className="flex justify-center mb-3">
                        <p>Vous n’avez pas encore de compte ? <Link className="text-color" to="/Inscription"
                                                                    onClick={() => window.scrollTo({
                                                                        top: 0,
                                                                        behavior: 'smooth'
                                                                    })}
                        >S’inscrire</Link></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginUser;
