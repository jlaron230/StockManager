import React, {useState, useEffect} from "react";
import Counter from "@components/Counter";
import {Link} from "react-router-dom";
const LegalNotice = () => {

    useEffect(() => {
        window.scrollTo({top, behavior: 'smooth' })
    }, [])

    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            <section id="legal">
                <h1 className="text-3xl font-semibold text-center mb-8">Mentions Légales</h1>

                <p className="mb-6">
                    Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, nous
                    vous
                    informons de l'identité des différents intervenants dans le cadre de la réalisation et du suivi de
                    notre
                    site.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Éditeur du site</h2>
                <p className="mb-6">
                    Le site <strong>www.exemple.com</strong> est édité par : <br/>
                    Nom de l'entreprise : Jerôme et Mael <br/>
                    Siège social : 2 Rue de la Fourane, 13090 Aix-en-Provence <br/>
                    Capital social : 50 000 € <br/>
                    Numéro d'immatriculation : RCS Aix-en-Provence
                    528 312 945 <br/>
                    Numéro de TVA intracommunautaire :
                    FR725 283 129 45 <br/>
                    Téléphone : 04 84 25 24 10 <br/>
                    Email : <a href="mailto:contact@exemple.com" className="text-blue-600">contact@exemple.com</a>
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">2. Hébergement</h2>
                <p className="mb-6">
                    Le site est hébergé par : <br/>
                    Hébergeur : Exemple Hébergement SAS <br/>
                    Siège social : 456 Rue Hébergement, 75000 Paris, France <br/>
                    Téléphone : +33 1 23 45 67 89
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Directeur de publication</h2>
                <p className="mb-6">
                    Le directeur de la publication du site est : <strong>Jean Dupont</strong>, en sa qualité de
                    Président
                    de l'entreprise Gestock-Manager SARL.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">4. Propriété intellectuelle</h2>
                <p className="mb-6">
                    Le contenu du site www.exemple.com, y compris les textes, images, vidéos, logos, graphiques, etc.,
                    est la
                    propriété exclusive de l'entreprise Jerôme et Mael SARL, sauf mention contraire. Toute reproduction, même
                    partielle,
                    est interdite sans autorisation préalable.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">5. Données personnelles</h2>
                <p className="mb-6">
                    Pour plus d'informations sur la collecte et le traitement de vos données personnelles, veuillez
                    consulter notre<br/>
                    <Link className="text-blue-600" to="/politique-de-confidentialite">
                         Politique de confidentialité
                    </Link>.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation de responsabilité</h2>
                <p className="mb-6">
                    L'entreprise Jerôme et Mael SARL ne pourra être tenue responsable des dommages directs ou indirects
                    résultant de
                    l'utilisation du site, y compris l'accès aux informations, la perte de données, ou tout autre
                    préjudice
                    matériel ou immatériel.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modification des mentions légales</h2>
                <p className="mb-6">
                    L'entreprise Jerôme et Mael SARL se réserve le droit de modifier les présentes mentions légales à tout
                    moment,
                    sans préavis. Les utilisateurs du site sont invités à les consulter régulièrement.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
                <p className="mb-6">
                    Pour toute question relative à ces mentions légales, vous pouvez nous contacter à l'adresse suivante
                    :
                    <strong>contact@exemple.com</strong>.
                </p>
            </section>
        </main>
    )
}

export default LegalNotice;