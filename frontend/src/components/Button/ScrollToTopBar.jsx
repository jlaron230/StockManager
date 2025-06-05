import {useEffect, useState} from "react";
import {ArrowDownIcon, ArrowUpIcon} from "@heroicons/react/16/solid";

const ScrollToTopBar = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Gère l'affichage du bouton en fonction du scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 125) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div
            className={`
        fixed z-50 bottom-6 right-6 transition-all duration-300 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
      `}
        >
            <button
                onClick={scrollToTop}
                className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                aria-label="Scroll to top"
            >
                <ArrowUpIcon className="h-6 w-6"/>
            </button>
        </div>
    );
};

export default ScrollToTopBar