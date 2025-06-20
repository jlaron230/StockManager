import * as Yup from "yup"; // Validation des formulaires
import { ErrorMessage, Field, Form, Formik } from "formik"; // Gestion de formulaire
import { Link, useNavigate } from "react-router-dom"; // Navigation et liens React Router
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid"; // Icônes pour afficher/masquer mot de passe
import { useEffect, useState } from "react"; // Hooks React pour état et effet
import axios from "axios"; // Requêtes HTTP

// Schéma de validation Yup pour chaque champ du formulaire
const SignupSchema = Yup.object().shape({
    prenom: Yup.string()
        .min(3, "3 Caractères minimum")
        .max(50, "Trop long!")
        .required("Requis"),
    nom: Yup.string()
        .min(3, "3 Caractères minimum")
        .max(50, "Trop long!")
        .required("Requis"),
    telephone: Yup.string()
        .matches(/^[0-9]{10}$/, "Le numéro doit contenir 10 chiffres")
        .required("Le numéro de téléphone est requis"),
    email: Yup.string()
        .required("Email requis")
        .matches(
            /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/,
            "Format d'email invalide : au moins 3 caractères après @ et 2 pour l'extension"
        ),
    acceptTerms: Yup.boolean()
        .oneOf([true], "Vous devez accepter les conditions")
        .required("Requis"),
    entreprise: Yup.string()
        .min(3, "3 Caractères minimum")
        .max(50, "Nom trop long")
        .required("Requis"),
    pays: Yup.string().required("Requis"),
    adresse: Yup.string()
        .min(5, "5 Caractères minimum")
        .max(50, "Adresse trop longue")
        .required("Requis"),
    ville: Yup.string()
        .min(3, "3 Caractères minimum")
        .max(50, "Nom trop long")
        .required("Requis"),
    postal: Yup.string()
        .matches(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres")
        .required("Code postal requis"),
    password: Yup.string()
        .min(8, "Le mot de passe doit comporter au moins 8 caractères")
        .max(50, "Le mot de passe doit comporter moins de 50 caractères")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial")
        .required("Requis"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
        .required("Requis"),
});

// Liste des pays proposés dans la sélection
const countries = [
    "France", "Brésil", "Japon", "Canada", "Australie",
    "Allemagne", "Italie", "Espagne", "Mexique", "Inde",
];

// Composant pour un champ input avec label et affichage des erreurs
const InputField = ({
                        label,
                        name,
                        type = "text",
                        placeholder,
                        showPassword,
                        handleTogglePassword,
                        showPasswordField,
                    }) => (
    <div className="flex flex-col mb-4">
        {/* Label du champ avec astérisque */}
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
            {label} <span className="text-red-700">*</span>
        </label>

        {/* Champ input */}
        <div className="relative">
            <Field
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full"
                required
            />

            {/* Bouton pour afficher/masquer le mot de passe */}
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

        {/* Affichage du message d'erreur sous le champ */}
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
);

const Inscription = () => {
    // État pour afficher ou cacher le mot de passe
    const [showPassword, setShowPassword] = useState(false);

    // État pour stocker le token CSRF récupéré depuis le backend
    const [token, setToken] = useState("");

    // Hook pour naviguer entre les pages
    const navigate = useNavigate();

    // Fonction pour basculer la visibilité du mot de passe
    const handleTogglePassword = () => setShowPassword(!showPassword);

    // Au chargement du composant, on récupère le token CSRF du backend
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/form-token`, { withCredentials: true })
            .then((res) => setToken(res.data.csrfToken))
            .catch((err) => console.error("Erreur récupération CSRF:", err));
    }, []);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Inscription</h1>

                {/* Formulaire Formik avec validation et soumission */}
                <Formik
                    initialValues={{
                        prenom: "",
                        nom: "",
                        telephone: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        entreprise: "",
                        pays: "",
                        adresse: "",
                        ville: "",
                        postal: "",
                        role: "undefined",
                        acceptTerms: false,
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
                        // Envoi des données au backend en POST
                        axios
                            .post(`${import.meta.env.VITE_BACKEND_URL}/register`, values, {
                                headers: { "Content-Type": "application/json", "x-csrf-token": token },
                                withCredentials: true,
                            })
                            .then(() => {
                                resetForm(); // Réinitialise le formulaire
                                navigate("/"); // Redirige vers la page d'accueil
                            })
                            .catch((error) => {
                                // Affiche l'erreur reçue sur le champ "general"
                                setFieldError("general", error.response?.data?.message || "Erreur lors de l'inscription");
                            })
                            .finally(() => setSubmitting(false));
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 mb-10">
                            {/* Champs prénom, nom, téléphone, email, entreprise */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Prénom" name="prenom" placeholder="John" />
                                <InputField label="Nom" name="nom" placeholder="Doe" />
                                <InputField label="Téléphone" name="telephone" placeholder="0612345678" />
                                <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
                                <InputField label="Entreprise" name="entreprise" placeholder="Ma Société" />

                                {/* Liste déroulante pour sélectionner un pays */}
                                <div className="flex flex-col mb-4">
                                    <label htmlFor="pays" className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                        Pays <span className="text-red-700">*</span>
                                    </label>
                                    <Field as="select" id="pays" name="pays" className="bg-gray-50 border rounded-lg p-2.5 w-full" required>
                                        <option value="">Sélectionnez un pays</option>
                                        {countries.map((c, i) => (
                                            <option key={i} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="pays" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Adresse, ville, code postal */}
                                <InputField label="Adresse" name="adresse" placeholder="8 rue de la paix" />
                                <InputField label="Ville" name="ville" placeholder="Paris" />
                                <InputField label="Code postal" name="postal" type="number" placeholder="75000" />
                            </div>

                            {/* Champ mot de passe avec bouton visibilité */}
                            <InputField
                                label="Mot de passe"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Taper un mot de passe"
                                showPasswordField
                                showPassword={showPassword}
                                handleTogglePassword={handleTogglePassword}
                            />

                            {/* Confirmation mot de passe */}
                            <InputField
                                label="Confirmation du mot de passe"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Retaper le mot de passe"
                                showPasswordField
                                showPassword={showPassword}
                                handleTogglePassword={handleTogglePassword}
                            />

                            {/* Checkbox d'acceptation des termes */}
                            <div className="flex items-center justify-center m-7">
                                <Field type="checkbox" name="acceptTerms" id="acceptTerms" className="mr-2" />
                                <label htmlFor="acceptTerms" className="text-sm text-gray-900 dark:text-white">
                                    <Link
                                        to="/condition-general-utilisation"
                                        className="text-color underline"
                                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                    >
                                        J'accepte les termes et conditions d'utilisation
                                    </Link>{" "}
                                    <span className="text-red-700">*</span>
                                </label>
                            </div>
                            <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-sm mt-1 text-center" />

                            {/* Bouton soumission */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-1/2 m-auto block text-white Primary-Color hover:bg-blue-700 rounded-lg px-5 py-2.5 font-medium"
                            >
                                {isSubmitting ? "En cours..." : "S'inscrire"}
                            </button>
                        </Form>
                    )}
                </Formik>

                {/* Ligne séparatrice */}
                <div className="border-b-4 border-gray-300 w-1/4 mx-auto mb-10"></div>

                {/* Lien vers la page de connexion */}
                <div className="flex justify-center mb-3">
                    <p>
                        Vous avez déjà un compte ?{" "}
                        <Link
                            to="/connexion"
                            className="text-color"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Inscription;
