import React, { useState, useEffect } from 'react';
import Spray from '@assets/image/Spray.jpg'
import { ArrowLeftIcon, ArrowRightIcon, DocumentArrowDownIcon} from '@heroicons/react/24/outline'
import axios from "axios";
import ButtonOrder from "@components/Button/ButtonOrder";
import {Link} from "react-router-dom";

const ProduitSection =({ autoSlide = true, autoSlideInterval = 8000 }) => {
    // Etat local pour index du slide courant
    const [currentIndex, setCurrentIndex] = useState(0);
    // Etat local pour stocker les données du produit (ici un seul produit)
    const [products, setProducts] = useState([]);
    // Etat local pour stocker la catégorie du produit
    const [category, setCategory] = useState([]);
    // Etat local pour le nom du produit en majuscules
    const [ProductNom, setProductNom] = useState([]);

    // Tableau des images à afficher dans le slider, basé sur les champs du produit
    const images = [
        `${products.image || ''}`,
        `${products.image_prev || ''}`,
        `${products.image_prev_two || ''}`
    ];

    // Fonction asynchrone pour récupérer les données produit et catégorie via API
    const fetchData = async () => {
        try {
            // Requête pour récupérer la liste des produits (ici on prend le premier)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, )
            const res = response.data;
            setProducts(res[0]);

            // Si le produit existe, mettre son nom en majuscules dans l'état
            if (res[0] && res[0].nom) {
                const name = res[0].nom.toUpperCase();
                setProductNom(name)
            }

            // Requête pour récupérer la liste des catégories (ici on prend la première)
            const categoryRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {withCredentials: true});
            setCategory(categoryRes.data[0]);
        } catch (error) {
            // En cas d'erreur, affichage en console
            console.log(error);
        }
    }

    // Hook pour appeler fetchData au montage du composant (équivalent componentDidMount)
    useEffect(() => {
        fetchData();
    }, [])

    // Hook pour gérer le défilement automatique des slides
    useEffect(() => {
        if (autoSlide) {
            const slideInterval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoSlideInterval);
            // Nettoyage de l'intervalle à la destruction ou si autoSlide change
            return () => clearInterval(slideInterval);
        }
    }, [autoSlide, autoSlideInterval, images.length]);

    // Fonction pour passer au slide suivant
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Fonction pour revenir au slide précédent
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <section className="">
            {/* Titre de la section */}
            <div className="flex flex-wrap justify-center mb-15">
                <h2 className="text-2xl text-color-default-2 font-semibold">Nos produits</h2>
            </div>

            {/* Vérifie si un produit est chargé */}
            {products ? (
                <div className=" mx-auto flex justify-center gap-15 flex-wrap">
                    {/* Container du slider */}
                    <div className="relative w-full max-w-xs">
                        <div className="overflow-hidden relative h-72 rounded-4xl">
                            {/* Boucle sur les images pour afficher le slide courant */}
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-transform transform rounded-4xl ${
                                        index === currentIndex ? 'translate-x-0' : 'translate-x-full'
                                    }`}
                                >
                                    <img src={image} alt={`Slide ${index}`} className="rounded-4xl w-full h-full object-contain"/>
                                </div>
                            ))}
                        </div>

                        {/* Bouton précédent */}
                        <button type="button"
                                className="shadow-md hover:scale-110 transition duration-300 rounded-3xl absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-white p-2"
                                onClick={prevSlide}
                        >
                            <ArrowLeftIcon className="w-5 text-color-dotted"/>
                        </button>
                        {/* Bouton suivant */}
                        <button type="button"
                                className="shadow-md rounded-3xl hover:scale-110 transition duration-300 absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-white p-2"
                                onClick={nextSlide}
                        >
                            <ArrowRightIcon className="w-5 text-color-dotted"/>
                        </button>
                    </div>

                    {/* Détails produit */}
                    <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-center mb-15">
                        <div
                            className="flex flex-col gap-5 w-full md:flex-1 min-[768px]:justify-center max-[768px]:items-center ">
                            {/* Nom du produit */}
                            <h1 className="text-left max-[768px]:text-center text-xl font-semibold">
                                {ProductNom}
                            </h1>
                            <p className="text-base font-medium">Détail techniques</p>

                            {/* Catégorie et prix */}
                            <div className="flex flex-col sm:flex-row items-center  gap-2 sm:gap-4">
                                <p className="bg-gray-200 px-4 py-2 rounded items-center sm:w-auto text-center sm:text-left">
                                    Catégorie
                                </p>
                                <p className="text-sm sm:text-base max-sm:text-center">{category.nom}</p>

                                <p className="bg-gray-200 px-4 py-2 rounded items-center sm:w-auto text-center sm:text-left">
                                    Prix
                                </p>
                                <p className="text-sm sm:text-base max-sm:text-center">{products.prix_unitaire} €</p>
                            </div>

                            {/* Zone texte avec description produit */}
                            <div className="w-full max-w-xs mx-auto bg-gray-50 p-3 md:p-2 rounded shadow-sm">
                                <p className="font-semibold text-sm md:text-xs mb-2">
                                    Détails article : <span className="text-blue-700 uppercase">{products.nom}</span>
                                </p>
                                <p className="text-xs md:text-[11px] text-gray-700 leading-snug md:leading-tight">
                                    {products.description}
                                </p>
                            </div>

                            {/* Bouton vers la page produit avec id */}
                            <div>
                                <Link to={`/produit/${products.id_product}`}>
                                    <ButtonOrder ButtonName="Voir plus" buttonType="submit"/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Message affiché si aucun produit disponible
                <div className="flex flex-wrap justify-center gap-15">
                    Aucun produit n'est disponible actuellement.
                </div>
            )}
        </section>
    )
}
export default ProduitSection
