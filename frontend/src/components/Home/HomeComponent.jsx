import React from "react";
import ButtonConnexion from "@components/Button/ButtonConnexion";
import ServiceSection from "@components/Home/ServiceSection";
import ProduitSection from "@components/Home/ProduitSection";
import {Link} from "react-router-dom";

const HomeComponent = () => {
    return (
        <>
            <header>
                <div className="relative bg-cover bg-center bg-no-repeat"
                     style={{backgroundImage: 'url("/Gestock-Header.png")'}}>

                    {/* ✅ Overlay sombre (ombrage sur l'image) */}
                    <div className="absolute inset-0 bg-black/50"></div>

                    {/* ✅ Contenu du header, positionné par-dessus l'overlay */}
                    <div className="relative z-10">
                        <div className="dark:bg-dark/80">
                            <div
                                className="container mx-auto flex text-center justify-center max-md:pb-40 max-md:pt-25 md:pt-25 md:pb-40">
                                <div className="flex flex-wrap items-center">
                                    <div className="w-full px-4">
                                        <div className="hero-content">
                                            <h1 className="mb-5 font-bold  text-white max-sm:text-[35px] sm:text-[42px] drop-shadow-lg">
                                                Vos besoins à portée de clic
                                            </h1>
                                            <p className="text-justify mb-5 max-w-[480px] text-xl text-body-color text-white">
                                                Découvrez notre application adaptée à vos besoins,
                                                optimisez votre gestion de stocks grâce à nos solutions.
                                            </p>
                                            <div>
                                                <Link to="/connexion">
                                                <ButtonConnexion/>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div>
                <ServiceSection/>
                <ProduitSection/>
            </div>
        </>
    )
}
export default HomeComponent