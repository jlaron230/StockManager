import { ChevronLeftIcon } from "@heroicons/react/24/outline";
const ButtonReturn = () => {
    return (
        <button type="button"
                className="flex text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2">
            <ChevronLeftIcon className="size-6" /> Retour</button>
    )
}
export default ButtonReturn