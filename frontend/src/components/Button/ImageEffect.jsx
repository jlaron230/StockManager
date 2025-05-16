import {useState} from "react";
const ImageEffect = ({image = [], nom}) => {
    const [selectedImage, setSelectedImage] = useState(image[0]);

    return (
        <div>
            <img src={selectedImage} alt={nom} className="w-70 h-auto my-4"/>
            <div className="flex flex-wrap justify-between">
                {image.map((img, index) => (
                    <div className="w-20">
                        <button key={index} type="submit" onClick={() => setSelectedImage(img)}>
                            <img src={img} alt={nom} className="w-full h-auto my-4"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ImageEffect;