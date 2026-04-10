import React, { useEffect, useRef, useState } from "react";

const ModalProduct = ({setModalOpen, modalOpen, supp, nameModal, descriptionModal}) => {

    const trigger = useRef(null);  // Référence pour un élément déclencheur (non utilisé ici)
    const modal = useRef(null);    // Référence pour la boîte modale

    // Ferme la modale si on clique en dehors de celle-ci
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!modal.current) return;
            // Ne rien faire si la modale est fermée, ou si on clique à l'intérieur de la modale ou sur l'élément déclencheur
            if (
                !modalOpen ||
                modal.current.contains(target) ||
                trigger.current?.contains?.(target)
            )
                return;
            // Sinon, fermer la modale
            setModalOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, [modalOpen]);

    // Ferme la modale si la touche "Échap" est pressée
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!modalOpen || keyCode !== 27) return;
            setModalOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    }, [modalOpen]);

    return (
        <>
            <div className={`container mx-auto py-20 `}>
                {/* Conteneur de la modale avec un fond sombre semi-transparent */}
                <div
                    className={`fixed left-0 top-0 flex h-full min-h-screen w-full transition duration-1000 items-center justify-center bg-black/50 px-4 py-5  ${
                        modalOpen ? "hidden" : "block"
                    }`}
                >
                    {/* Contenu principal de la modale */}
                    <div
                        ref={modal}
                        className="max-w-[570px] rounded-md border border-black rounded-[20px] bg-gray-50 px-8 py-8 text-center dark:bg-dark-2 "
                    >
                        <h3 className="pb-[18px] text-xl font-semibold text-dark dark:text-white sm:text-2xl">
                            {nameModal}
                        </h3>
                        <p className="mb-10 text-base leading-relaxed text-body-color dark:text-dark-6">
                            {descriptionModal}
                        </p>
                        {/* Boutons d'action */}
                        <div className="-mx-3 flex flex-wrap justify-center">
                            <div className="px-3 flex gap-6">
                                <button
                                    aria-label="Modal de suppression"
                                    onClick={() => supp(true)}
                                    className="block bg-red-500 w-full rounded-md border border-stroke p-3 text-center text-base font-medium text-white transition hover:border-red-600 hover:bg-red-600 hover:text-white dark:text-white"
                                >
                                    Supprimer
                                </button>
                                <button
                                    aria-label="Modal d'annulation"
                                    onClick={() => setModalOpen(true)}
                                    className="block w-full rounded-md border border-gray-500 border-stroke p-3 text-center text-base font-medium text-dark transition hover:border-black hover:bg-gray-300 hover:text-black dark:text-white"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ModalProduct;
