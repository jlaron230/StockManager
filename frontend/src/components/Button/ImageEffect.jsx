import { useState } from "react";

const ImageEffect = ({ image = [], nom }) => {
    // State pour garder l'image sélectionnée, initialisée à la première image du tableau
    const [selectedImage, setSelectedImage] = useState(image[0]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Conteneur de l'image principale affichée */}
            <div className="w-full max-w-md h-84 mx-auto overflow-hidden rounded-lg">
                <img
                    src={selectedImage}
                    alt={nom}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Galerie de miniatures cliquables */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4">
                {image.map((img, index) => (
                    <button
                        aria-label="Bouton cliquables pour les miniatures d'images"
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(img)} // Met à jour l'image affichée
                        className="w-16 md:w-20 lg:w-24 border border-gray-300 rounded overflow-hidden hover:scale-105 transition-transform"
                    >
                        <img
                            src={img}
                            alt={`${nom} ${index}`} // Texte alternatif spécifique par miniature
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageEffect;
