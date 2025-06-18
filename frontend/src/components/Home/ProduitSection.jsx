import React, { useState, useEffect } from 'react';
import Spray from '@assets/image/Spray.jpg'
import { ArrowLeftIcon, ArrowRightIcon, DocumentArrowDownIcon} from '@heroicons/react/24/outline'
import axios from "axios";
import ButtonOrder from "@components/Button/ButtonOrder";
import {Link} from "react-router-dom";

const ProduitSection =({ autoSlide = true, autoSlideInterval = 8000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [ProductNom, setProductNom] = useState([]);

    const images = [
        `${products.image || ''}`,
        `${products.image_prev || ''}`,
        `${products.image_prev_two || ''}`
    ];

    const fetchData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, )
            const res = response.data;
            setProducts(res[0]);

            if (res[0] && res[0].nom) {
           const name = res[0].nom.toUpperCase();
            setProductNom(name)
            }

            const categoryRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {withCredentials: true});
            setCategory(categoryRes.data[0]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (autoSlide) {
            const slideInterval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoSlideInterval);
            return () => clearInterval(slideInterval);
        }
    }, [autoSlide, autoSlideInterval, images.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <section className="">
            <div className="flex flex-wrap justify-center mb-15">
                <h2 className="text-2xl text-color-default-2 font-semibold">Nos produits</h2>
            </div>
            {products ? (
            <div className=" mx-auto flex justify-center gap-15 flex-wrap">
                <div className="relative w-full max-w-xs">
                <div className="overflow-hidden relative h-72 rounded-4xl">
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

                <button type="button"
                        className="shadow-md hover:scale-110 transition duration-300 rounded-3xl absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-white p-2"
                        onClick={prevSlide}
                >
                    <ArrowLeftIcon className="w-5 text-color-dotted"/>
                </button>
                <button type="button"
                        className="shadow-md rounded-3xl hover:scale-110 transition duration-300 absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-white p-2"
                        onClick={nextSlide}
                >
                    <ArrowRightIcon className="w-5 text-color-dotted"/>
                </button>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-center mb-15">
                <div
                    className="flex flex-col gap-5 w-full md:flex-1 min-[768px]:justify-center max-[768px]:items-center ">
                    <h1 className="text-left max-[768px]:text-center text-xl font-semibold">
                        {ProductNom}
                    </h1>
                    <p className="text-base font-medium">Détail techniques</p>

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

                    {/*<div className="flex flex-col gap-2">
                       <a className="flex items-center gap-2 text-blue-600 hover:underline" href="#">
                            Voir la fiche technique
                            <DocumentArrowDownIcon className="w-6 h-6" />
                        </a>
                        <a className="flex items-center gap-2 text-blue-600 hover:underline" href="#">
                            Voir la fiche technique
                            <DocumentArrowDownIcon className="w-6 h-6" />
                        </a>
                    </div>*/}

                    <div className="w-full max-w-xs mx-auto bg-gray-50 p-3 md:p-2 rounded shadow-sm">
                        <p className="font-semibold text-sm md:text-xs mb-2">
                            Détails article : <span className="text-blue-700 uppercase">{products.nom}</span>
                        </p>
                        <p className="text-xs md:text-[11px] text-gray-700 leading-snug md:leading-tight">
                            {products.description}
                        </p>
                    </div>
                    <div>
                        <Link to={`/produit/${products.id_product}`}>
                            <ButtonOrder ButtonName="Voir plus" buttonType="submit"/>
                        </Link>
                    </div>
                </div>
            </div>
            </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-15">
                    Aucun produit n'est disponible actuellement.
                </div>
            )}
        </section>
    )
}
export default ProduitSection