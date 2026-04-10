import ButtonEdit from "@components/Button/ButtonEdit";
import ButtonValidate from "@components/Button/ButtonValidate";

const OptionText = ({value, isEditing, onClick, onChange, onValidate}) => {
    return (
        <>
            {/* Input texte, en lecture seule sauf en mode édition */}
            <input
                type="text"
                value={value}
                readOnly={!isEditing}
                onClick={onClick}
                onChange={onChange}
                className={`border px-2 py-1 rounded-md w-32 transition duration-200
                    ${isEditing ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-100 cursor-pointer'}`}
            />
            {/* Affiche soit le bouton d'édition soit de validation selon le mode */}
            {!isEditing ? (
                <ButtonEdit onClick={onClick} />
            ) : (
                <ButtonValidate onClick={onValidate} />
            )}
        </>
    )
}

export default OptionText;
