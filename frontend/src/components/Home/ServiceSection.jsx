import React, {useEffect, useState} from "react";
import imageBoutique from "@assets/image/Boutique-home.png";
import imageFournisseur from "@assets/image/Fournisseur-home.png";
import imageProduit from "@assets/image/produit-home.png";
import ButtonConnexion from "@components/Button/ButtonConnexion";
import ButtonOrder from "@components/Button/ButtonOrder";

const ServiceSection = () => {
    // Etat local pour stocker la catégorie affichée ("boutique" par défaut)
    const [showCard, setShowCard] = useState("boutique");

    // Fonction pour mettre à jour la catégorie affichée (en minuscules)
    const handleProject = (category) => {
        setShowCard(category.toLowerCase());
    };

    return (
        <>
            <section className="pt-20 pb-12 lg:pt-[35px] lg:pb-[90px] dark:bg-dark">
                <div className="container mx-auto">
                    <div className="w-full flex flex-wrap justify-center">
                        <div className="w-full px-4 flex flex-wrap justify-center items-center">
                            {/* Liste de boutons pour changer la catégorie visible */}
                            <ul className="flex flex-wrap justify-center mb-12 space-x-1 gap-20 flex-row">
                                {/* Bouton Produit avec image */}
                                <li className="mb-1 basis-55 flex flex-wrap justify-center items-start items-center">
                                    <button
                                        onClick={() => handleProject("Produit")}
                                        className={`inline-block rounded-lg py-2 px-5 text-center text-2xl font-bold text-color-default-2 transition md:py-3 lg:px-8 ${
                                            showCard === "Produit"
                                                ? "activeClasses bg-primary "
                                                : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary hover:text-white"
                                        }`}
                                    >
                                        Produit
                                    </button>
                                    <div>
                                        <button type="button" onClick={() => handleProject("Produit")}
                                                className={`${
                                                    showCard === "produit"
                                                        ? "activeClasses bg-primary border-b-4 border-dotted text-color-dotted w-65 p-2"
                                                        : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary hover:text-white "
                                                }`}>
                                            <img className="hover:scale-110 transition duration-300 active:scale-0" src={imageProduit} alt=""/>
                                        </button>
                                    </div>
                                </li>
                                {/* Bouton Boutique avec image */}
                                <li className="mb-1 basis-55 text-center">
                                    <button
                                        onClick={() => handleProject("Boutique")}
                                        className={`inline-block rounded-lg py-2 px-5 text-2xl font-bold text-center transition md:py-3 lg:px-8 text-color-default-2  ${
                                            showCard === "Boutique"
                                                ? "activeClasses bg-primary"
                                                : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary hover:text-white"
                                        }`}
                                    >
                                        Boutique
                                    </button>
                                    <div>
                                        <button type="button" onClick={() => handleProject("boutique")} className={`${
                                            showCard === "boutique"
                                                ? "activeClasses bg-primary border-b-4 border-dotted text-color-dotted w-58"
                                                : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary hover:text-white"
                                        }`}>
                                            <img className={`duration-300 active:scale-0 ${
                                                showCard === "boutique"
                                                    ? "activeClasses bg-primary"
                                                    : "inactiveClasses text-body-color hover:scale-110 transition dark:text-dark-6 hover:bg-primary hover:text-white"
                                            }`} src={imageBoutique} alt=""/>
                                        </button>
                                    </div>
                                </li>
                                {/* Bouton Fournisseur avec image */}
                                <li className="mb-1 basis-55 text-center">
                                    <button
                                        onClick={() => handleProject("Fournisseur")}
                                        className={`inline-block rounded-lg py-2 px-5 text-center text-2xl font-bold text-color-default-2 transition md:py-3 lg:px-8 ${
                                            showCard === "Fournisseur"
                                                ? "activeClasses bg-primary"
                                                : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary"
                                        }`}
                                    >
                                        Fournisseur
                                    </button>
                                    <div>
                                        <button type="button" onClick={() => handleProject("Fournisseur")}
                                                className={`${
                                                    showCard === "fournisseur"
                                                        ? "activeClasses bg-primary border-b-4 border-dotted text-color-dotted w-57"
                                                        : "inactiveClasses text-body-color dark:text-dark-6 hover:bg-primary hover:text-white"
                                                }`}>
                                            <img className="hover:scale-110 active:scale-0 transition duration-300" src={imageFournisseur} alt=""/>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Affichage conditionnel des cartes de portfolio selon la catégorie sélectionnée */}
                    <div className="flex flex-wrap justify-center">
                        <PortfolioCard
                            ImageHref="/Boutique.png"
                            category="Boutique"
                            title="Gestion de votre boutique"
                            button="Voir plus"
                            descriptionService="Solution de gestion de votre boutique.
Gérer les besoins de votre établissement
à votre manière."
                            buttonHref="boutique-manage"
                            showCard={showCard}
                        />
                        <PortfolioCard
                            ImageHref="/Fournisseur.jpg"
                            category="Fournisseur"
                            title="Service fournisseur"
                            button="Voir plus"
                            descriptionService="Un service optimisé pour
Gérer vos fournisseurs"
                            buttonHref="fournisseur"
                            showCard={showCard}
                        />
                        <PortfolioCard
                            ImageHref="/ProduitSection.jpg"
                            category="Produit"
                            title="Création de produit"
                            button="Voir plus"
                            buttonHref="produit"
                            descriptionService="Créer et gerer vos produits de votre boutique"
                            showCard={showCard}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}
export default ServiceSection

// Composant affichant une carte portfolio avec animation au chargement
const PortfolioCard = ({
                           showCard,
                           category,
                           ImageHref,
                           title,
                           button,
                           buttonHref,
                           descriptionService,
                       }) => {
    // Etat pour gérer la transition d'opacité et flou de l'image au chargement
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <>
            <div
                className={`w-full px-4 md:w-1/2 xl:w-2/3 ${
                    // Affiche ou masque la carte selon la catégorie sélectionnée
                    showCard === "all" || showCard === category.toLowerCase()
                        ? "block"
                        : "hidden"
                }`}
            >
                <div className="relative mb-12">
                    <div
                        className="relative z-10 mx-7 -mt-20 rounded-lg dark:bg-dark-2 py-[34px] px-3 text-center shadow-portfolio dark:shadow-box-dark">
                        <h3 className="text-dark dark:text-white mb-5 text-xl font-bold text-color-default-2">{title}</h3>
                        <p className="mb-8">{descriptionService}</p>
                        <a
                            href={buttonHref}
                            className="text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-8 py-3 text-center me-2"
                        >
                            {button}
                        </a>
                    </div>
                </div>
                <div className="overflow-hidden rounded-[10px] flex justify-center">
                    {/* Image avec animation de transition quand elle est chargée */}
                    <img src={ImageHref} alt="portfolio"
                         onLoad={() => setIsLoaded(true)}
                         className={`
                            w-140 transition-all duration-1000 ease-out rounded-lg
                            ${isLoaded ? 'opacity-100 blur-0 animate-fadeIn' : 'opacity-0 blur-2xl'}
                            `}/>
                </div>
            </div>
        </>
    );
};
