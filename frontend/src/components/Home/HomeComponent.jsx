import React from "react";
import ButtonConnexion from "@components/Button/ButtonConnexion";
import ServiceSection from "@components/Home/ServiceSection";

const HomeComponent = () => {
    return (
        <>
        <header>
            <div
                className="relative bg-white dark:bg-dark  "
            >
                <div className="container mx-auto flex text-center justify-center max-md:pb-40 max-md:pt-25 md:pt-25 md:pb-40">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full px-4 ">
                            <div className="hero-content">
                                <h1
                                    className="mb-5 font-bold !leading-[1.208] text-dark dark:text-white max-sm:text-[35px] sm:text-[42px]  "
                                >
                                    Vos besoins à portée de clic
                                </h1>
                                <p
                                    className="text-justify mb-5 max-w-[480px] text-base text-body-color dark:text-dark-6"
                                >
                                    Découvrez notre application adaptée à vos besoins
                                    optimisez votre gestion de stocks grâce à nos solutions
                                </p>
                                <div>
                                <ButtonConnexion />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div>
            <ServiceSection />
        </div>
        </>
    )
}
export default HomeComponent