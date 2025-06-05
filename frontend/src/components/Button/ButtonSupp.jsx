const ButtonSupp = ({onClick, NameSupp}) => {
    return (
        <button type="button"
                onClick={onClick}
                className="text-white bg-red-500 from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2">
            {NameSupp}</button>
    )
}

export default ButtonSupp