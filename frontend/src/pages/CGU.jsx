import React, {useState, useEffect} from "react";
import Counter from "@components/Counter";
import {Link} from "react-router-dom";
const CGU = () => {
    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            <section id="cgu">
                <h1 className="text-3xl font-semibold text-center mb-8">Conditions Générales d'Utilisation</h1>

                <p className="mb-6">
                    Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de notre site
                    web <strong>www.exemple.com</strong>.
                    En accédant et en utilisant ce site, vous acceptez de vous conformer aux présentes CGU.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Objet du site</h2>
                <p className="mb-6">
                    Le site www.exemple.com a pour objectif de fournir des services en ligne tels que la gestion de
                    contenu,
                    la mise à disposition d'outils interactifs, et l'accès à des informations diverses. L'utilisation
                    des services
                    offerts est soumise aux présentes CGU.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">2. Accès au site</h2>
                <p className="mb-6">
                    L'accès au site est gratuit pour les utilisateurs disposant d'une connexion Internet. Tous les frais
                    liés à
                    l'accès au site (matériel, logiciels, abonnement Internet, etc.) sont à la charge de l'utilisateur.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Inscription et création de compte</h2>
                <p className="mb-6">
                    Certaines fonctionnalités du site nécessitent la création d'un compte utilisateur. Lors de
                    l'inscription, vous
                    vous engagez à fournir des informations exactes et complètes. Vous êtes responsable de la
                    confidentialité de
                    votre mot de passe et de l'utilisation de votre compte.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">4. Utilisation des services</h2>
                <p className="mb-6">
                    L'utilisateur s'engage à utiliser les services du site conformément à leur objet, de manière légale,
                    et sans
                    nuire au bon fonctionnement du site. Il s'engage à ne pas utiliser le site à des fins frauduleuses
                    ou illégales,
                    et à respecter la législation en vigueur.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">5. Propriété intellectuelle</h2>
                <p className="mb-6">
                    Tous les contenus présents sur le site, y compris les textes, images, vidéos, logos, et autres
                    éléments
                    graphiques, sont protégés par des droits de propriété intellectuelle. Toute reproduction,
                    représentation ou
                    utilisation non autorisée des contenus est interdite.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">6. Protection des données personnelles</h2>
                <p className="mb-6">
                    Le traitement des données personnelles est effectué conformément à notre <br/>
                    <Link className="text-blue-600" to="/politique-de-confidentialite">
                    Politique de confidentialité
                    </Link>.
                    L'utilisateur peut accéder, rectifier ou supprimer ses données personnelles en contactant notre
                    support.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">7. Responsabilité</h2>
                <p className="mb-6">
                    L'utilisateur utilise le site à ses propres risques. L'entreprise Jerôme et Mael SARL ne pourra être tenue
                    responsable
                    des dommages directs ou indirects résultant de l'utilisation du site ou des services associés.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">8. Modification des CGU</h2>
                <p className="mb-6">
                    L'entreprise Jerôme et Mael SARL se réserve le droit de modifier les présentes CGU à tout moment, sans
                    préavis.
                    Les utilisateurs du site sont invités à consulter régulièrement cette page pour prendre connaissance
                    des
                    dernières versions des CGU.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">9. Droit applicable et juridiction</h2>
                <p className="mb-6">
                    Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux compétents de
                    Paris seront
                    seuls compétents pour trancher toute contestation relative à l'utilisation du site.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact</h2>
                <p className="mb-6">
                    Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l'adresse suivante :
                    <strong>contact@exemple.com</strong>.
                </p>
            </section>
        </main>

    )
}

export default CGU;