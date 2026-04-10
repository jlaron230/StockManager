import React, {useEffect} from "react";
//Page politique de confidentialité
const PrivacyPolicy = () => {
    //Scroll to top
    useEffect(() => {
        window.scrollTo({top, behavior: 'smooth' })
    }, [])
    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            <section id="privacy">
                <h1 className="text-3xl font-semibold text-center mb-8">Politique de confidentialité</h1>

                <p className="mb-6">
                    La présente politique de confidentialité décrit comment nous recueillons, utilisons et protégeons
                    vos
                    informations personnelles lorsque vous utilisez notre site web.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
                <p className="mb-6">
                    Nous attachons une grande importance à la protection de vos données personnelles et nous nous
                    engageons à
                    respecter la confidentialité de vos informations. Cette politique vous informe sur les données que
                    nous
                    collectons, leur utilisation et les mesures prises pour les protéger.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">2. Collecte des informations personnelles</h2>
                <p className="mb-6">
                    Nous collectons certaines informations personnelles lorsque vous remplissez des formulaires sur
                    notre
                    site, telles que votre nom, votre adresse e-mail et d'autres informations nécessaires à l'exécution
                    de
                    nos services.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Utilisation des informations</h2>
                <p className="mb-6">
                    Les informations recueillies sont utilisées pour fournir nos services, vous contacter, vous envoyer
                    des
                    informations marketing (avec votre consentement) et améliorer l'expérience utilisateur sur notre
                    site.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">4. Partage des informations</h2>
                <p className="mb-6">
                    Nous ne partageons pas vos informations personnelles avec des tiers sans votre consentement, sauf si
                    cela
                    est nécessaire pour répondre à une obligation légale ou pour protéger nos droits.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">5. Sécurité des données</h2>
                <p className="mb-6">
                    Nous prenons toutes les mesures de sécurité raisonnables pour protéger vos données personnelles
                    contre tout
                    accès non autorisé ou toute divulgation.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">6. Vos droits</h2>
                <p className="mb-6">
                    Vous avez le droit d'accéder, de rectifier, de supprimer ou de limiter l'utilisation de vos données
                    personnelles. Vous pouvez exercer vos droits en nous contactant à l'adresse indiquée ci-dessous.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
                <p className="mb-6">
                    Si vous avez des questions ou des préoccupations concernant notre politique de confidentialité, vous
                    pouvez
                    nous contacter à l'adresse suivante : <strong>Jerome.gavino@ynov.com ou mael.compagny@ynov.com</strong>.
                </p>
            </section>
        </main>

    )
}

export default PrivacyPolicy;