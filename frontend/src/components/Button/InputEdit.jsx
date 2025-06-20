import { useState } from "react";

const ImageEffect = ({ image = [], nom }) => {
    // Garde l'image sélectionnée, par défaut la première
    const [selectedImage, setSelectedImage] = useState(image[0]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Image principale affichée */}
            <div className="w-full max-w-md h-84 mx-auto overflow-hidden rounded-lg">
                <img
                    src={selectedImage}
                    alt={nom}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Miniatures cliquables pour changer l'image */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4">
                {image.map((img, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(img)} // Change l'image affichée
                        className="w-16 md:w-20 lg:w-24 border border-gray-300 rounded overflow-hidden hover:scale-105 transition-transform"
                    >
                        <img
                            src={img}
                            alt={`${nom} ${index}`} // Alt pour chaque miniature
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageEffect;
