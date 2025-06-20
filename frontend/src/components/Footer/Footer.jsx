import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import Instagram from '@assets/image/Instagram.png';
import Linkedin from '@assets/image/Linkedin.png';
import X from '@assets/image/X.png';
import Amazon from '@assets/image/Amazon.png';
import Meta from '@assets/image/Meta.png';
import Tesla from '@assets/image/Tesla.png';
import {Link} from "react-router-dom";
import {useState} from "react";

// Schéma de validation avec Yup pour le formulaire de contact
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
        .matches(/^[0-9]{10}$/, 'le numéro doit contenir des caractères numérique')
        .required('Le numéro de téléphone est requis'),
    email: Yup.string().email('Invalid email').required('Requis'),
    acceptTerms: Yup.boolean()
        .oneOf([true], 'Vous devez accepter les conditions')
        .required('Requis'),
    message: Yup.string().min(10, 'Message trop court').required('Veuillez saisir un message'),
});

const Footer = () => {
    // Etat local pour indiquer si un message a été reçu (non utilisé dans ce code)
    const [receiveMessage, setReceiveMessage] = useState(false);

    return (
        <>
            <footer id="footer">
                {/* Conteneur principal du footer avec flex et responsive */}
                <div className="flex max-[984px]:justify-evenly min-[984px]:justify-between w-full flex-wrap mt-5 max-sm:gap-25 sm:gap-5 p-10 border-t-1 border-t-black">

                    {/* Formulaire de contact géré par Formik */}
                    <Formik
                        initialValues={{
                            firstName: "",
                            lastName: "",
                            email: "",
                            acceptTerms: false,
                            phone: "",
                            message: ""
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values, {resetForm}) => {
                            // Affiche les valeurs dans la console au submit
                            console.log(values)
                            // Confirme l'envoi du message
                            if (!window.confirm(`Message envoyé`)) return;
                            // Réinitialise le formulaire après confirmation
                            resetForm();
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className="max-w-md">
                                <div>
                                    {/* Titre du formulaire */}
                                    <h2 className="mb-5 text-2xl text-color-default-2">Formulaire de contact</h2>

                                    {/* Champs prénom et nom */}
                                    <div className="flex flex-wrap sm:gap-4">
                                        <div className="mb-5 max-sm:w-full sm:max-w-44">
                                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Prénom
                                            </label>
                                            <Field
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="john" required/>
                                            <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1"/>
                                        </div>
                                        <div className="mb-5 max-sm:w-full sm:max-w-44">
                                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Nom
                                            </label>
                                            <Field
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="doe" required/>
                                            <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1"/>
                                        </div>
                                    </div>

                                    {/* Champs email et téléphone */}
                                    <div className="flex flex-wrap sm:gap-4">
                                        <div className="mb-5 max-sm:w-full sm:max-w-44">
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Your email
                                            </label>
                                            <Field
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="name@flowbite.com" required/>
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1"/>
                                        </div>
                                        <div className="mb-5 max-sm:w-full sm:max-w-44">
                                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Téléphone
                                            </label>
                                            <Field
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="+33 612500" required/>
                                            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1"/>
                                        </div>
                                    </div>

                                    {/* Champ message */}
                                    <div className="mb-5 max-sm:w-full sm:max-w-92">
                                        <Field as="textarea"
                                               name="message"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                               placeholder="Votre message" required/>
                                        <ErrorMessage name="message" component="div" className="text-red-500 text-sm mt-1"/>
                                    </div>

                                    {/* Case à cocher accepter la politique de confidentialité */}
                                    <div className="flex items-start mb-5 max-sm:w-full sm:max-w-44">
                                        <div className="flex items-center h-5">
                                            <Field name="acceptTerms" type="checkbox"
                                                   className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                                   required/>
                                            <ErrorMessage name="acceptTerms" component="div" className="text-red-500 text-sm mt-1"/>
                                        </div>
                                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Accepter la politique de confidentialité
                                        </label>
                                    </div>

                                    {/* Bouton d'envoi du formulaire */}
                                    <button type="submit" disabled={isSubmitting}
                                            className="text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center">
                                        Envoyer
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {/* Section Réseaux sociaux */}
                    <div className="max-sm:text-center">
                        <h2 className="mb-5 text-2xl text-color-default-2">Réseaux sociaux</h2>
                        <div className="">
                            <div className="flex justify-center items-center">
                                <a href="#"><img className="m-5 w-10" src={X} alt="f"></img></a>
                                <a href="#"><img className="w-20" src={Linkedin} alt="f"></img></a>
                                <a href="#"><img className="w-20" src={Instagram} alt="f"></img></a>
                            </div>
                            <div className="flex justify-center">
                                <Link to="/a-propos">
                                    <button type="submit"
                                            className="text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center">
                                        A propos
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Section Sponsors */}
                    <div className="max-sm:text-center">
                        <h2 className="mb-5 text-2xl text-color-default-2">Sponsors</h2>
                        <div className="flex justify-center items-center">
                            <a href="#"><img className="m-4 w-10" src={Tesla} alt="f"></img></a>
                            <a href="#"><img className="m-4 w-10" src={Amazon} alt="f"></img></a>
                            <a href="#"><img className="m-4 w-10" src={Meta} alt="f"></img></a>
                        </div>
                        <div className="flex justify-center items-center">
                            <a href="#"><img className="m-4 w-10" src={Tesla} alt="f"></img></a>
                            <a href="#"><img className="m-4 w-10" src={Amazon} alt="f"></img></a>
                            <a href="#"><img className="m-4 w-10" src={Meta} alt="f"></img></a>
                        </div>
                    </div>

                    {/* Section Navigation */}
                    <div className="max-sm:text-center">
                        <h2 className="mb-5 text-2xl text-color-default-2">Navigation</h2>
                        <div className="flex gap-2 flex-col">
                            <Link to="/politique-de-confidentialite" className="hover:text-gray-500">
                                Politique de confidentialité
                            </Link>
                            <Link to="/condition-general-utilisation" className="hover:text-gray-500">
                                Conditions générale d'utilisation
                            </Link>
                            <Link to="notice-utilisation" className="hover:text-gray-500">
                                Mentions légales
                            </Link>
                            <a href="#" className="hover:text-gray-500">Plan du site</a>
                        </div>

                        {/* Section application mobile */}
                        <div className="flex gap-4 flex-col mt-5">
                            <h3 className="mb-5 text-lg text-color-default-2">Notre application mobile</h3>
                            <button type="submit"
                                    className="text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center">
                                Voir plus
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bas de page copyright */}
                <div className="flex justify-center m-3 text-center">
                    <p>Copyright 2025 © Gestock. tous droits réservés</p>
                </div>
            </footer>
        </>
    )
}
export default Footer;
