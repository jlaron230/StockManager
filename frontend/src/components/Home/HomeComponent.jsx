import React, {useEffect, useState} from "react";
import ButtonConnexion from "@components/Button/ButtonConnexion";
import ServiceSection from "@components/Home/ServiceSection";
import ProduitSection from "@components/Home/ProduitSection";
import {Link, useNavigate} from "react-router-dom";
import ButtonConnexionHome from "@components/Button/ButtonConnexionHome";

const HomeComponent = () => {
    // Etat local pour savoir si l'utilisateur est connecté (true par défaut)
    const [Connect, setConnect] = useState(true);
    // Hook pour navigation programmatique dans react-router
    const navigate = useNavigate();

    // Fonction asynchrone pour récupérer la session utilisateur côté backend
    const fetchAllData = async () => {
        try {
            // Requête GET vers l'API /session avec cookies inclus
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
                method: "GET",
                credentials: "include",
            });

            // Si la réponse n'est pas OK (401, 403, etc), on considère que l'utilisateur n'est pas connecté
            if (!res.ok) {
                setConnect(false);
                return;
            } else {
                // Sinon, l'utilisateur est connecté
                setConnect(true);
            }
        } catch (error) {
            // En cas d'erreur réseau ou autre, on log l'erreur
            console.error("Erreur lors de la récupération de la session :", error);
        }
    };

    // Hook d'effet pour appeler fetchAllData au montage du composant
    useEffect(() => {
        fetchAllData();
    }, [])

    // Affichage de l'état de connexion dans la console (pour debug)
    console.log(Connect)

    return (
        <>
            <header>
                {/* Conteneur principal avec image de fond */}
                <div className="relative bg-cover bg-center bg-no-repeat"
                     style={{backgroundImage: 'url("/Gestock-Header.jpg")'}}>

                    {/* Overlay sombre semi-transparent au-dessus de l'image */}
                    <div className="absolute inset-0 bg-black/50"></div>

                    {/* Contenu textuel placé au-dessus de l'overlay */}
                    <div className="relative z-10">
                        <div className="dark:bg-dark/80">
                            <div
                                className="container mx-auto flex text-center justify-center max-md:pb-25 max-md:pt-20 md:pt-20 md:pb-20">
                                <div className="flex flex-wrap items-center">
                                    <div className="w-full px-4">
                                        <div className="hero-content">
                                            {/* Titre principal */}
                                            <h1 className="mb-5 font-bold  text-white max-sm:text-[35px] sm:text-[42px] drop-shadow-lg">
                                                Vos besoins à portée de clic
                                            </h1>
                                            {/* Paragraphe descriptif */}
                                            <p className="text-justify mb-5 max-w-[480px] text-xl text-body-color text-white">
                                                Découvrez notre application adaptée à vos besoins,
                                                optimisez votre gestion de stocks grâce à nos solutions.
                                            </p>
                                            {/* Bouton affiché selon l'état de connexion */}
                                            {Connect ? (
                                                <div>
                                                    {/* Bouton profil utilisateur si connecté */}
                                                    <ButtonConnexionHome ButtonName="Mon profil" Onclick={fetchAllData} connexion="/Dashboard"/>
                                                </div>
                                            ) : (
                                                <div>
                                                    {/* Bouton connexion si non connecté */}
                                                    <ButtonConnexionHome ButtonName="Connexion" Onclick={fetchAllData} connexion="/connexion"/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Section principale affichant services et produits */}
            <div className="m-5 p-2">
                <ServiceSection/>
                <ProduitSection/>
            </div>
        </>
    )
}
export default HomeComponent
