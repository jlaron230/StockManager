import {BeakerIcon, PaintBrushIcon} from "@heroicons/react/16/solid";
import {useEffect} from "react";

//Array of presentation participants
const features = [
    {
        name: 'Partie design : ',
        description:
            'Jérôme s’est chargé de toute la partie design ainsi que de la liaison entre le front-end et le back-end, tout en n’hésitant pas à mettre les mains dans le code serveur quand il le fallait !',
        icon: PaintBrushIcon,
    },
    {
        name: 'Partie back : ',
        description: 'Maël, quant à lui, a développé l’ensemble de la logique back-end et a également prêté main-forte sur le front pour affiner l’interface et l’expérience utilisateur.',
        icon: BeakerIcon,
    },
]

const About = () => {
    //Scroll to top
    useEffect(() => {
        window.scrollTo({top, behavior: 'smooth' })
    }, [])

        return (
            <div className="overflow-hidden bg-white py-10 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-11 lg:max-w-none lg:grid-cols-2">
                        <div className="lg:pt-4 lg:pr-8">
                            <div className="lg:max-w-lg">
                                <h2 className="text-base/7 font-semibold text-indigo-600">A propos de nous</h2>
                                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                    Gestock, une aventure unique
                                </p>
                                <p className="mt-6 text-lg/8 text-gray-600">
                                    Nous vous présentons Mael Company et Jérôme Gavino, deux alternants passionnés en développement web, actuellement en 3e année à Ynov.

                                    Ensemble, ils ont uni leurs compétences pour créer une application fonctionnelle, esthétique et bien pensée. 💻✨
                                </p>
                                <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                                    {features.map((feature) => (
                                        <div key={feature.name} className="relative pl-9">
                                            <dt className="inline font-semibold text-gray-900">
                                                <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-600" />
                                                {feature.name}
                                            </dt>{' '}
                                            <dd className="inline">{feature.description}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                        <img
                            alt="Product screenshot"
                            src="/APropos.png"
                            width={1600}
                            height={700}
                            className="w-3xl max-w-lg rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0"
                        />
                    </div>
                </div>
            </div>
        )
}
export default About;