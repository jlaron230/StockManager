const ButtonValidate = ({onClick}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-white Primary-Color from-purple-600 to-red-50 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2"
        >
            Valider
        </button>
    )
}
export default ButtonValidate