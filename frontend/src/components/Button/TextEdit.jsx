import ButtonEdit from "@components/Button/ButtonEdit";
import ButtonValidate from "@components/Button/ButtonValidate";

const TextEdit = ({value, isEditing, onClick, onChange, onValidate}) => {
    return (
        <>
            <textarea
                rows="2" cols="33"
                value={value}
                readOnly={!isEditing}
                onClick={onClick}
                onChange={onChange}
                className={`border px-2 py-1 rounded-md w-32 transition duration-200
                    ${isEditing ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-100 cursor-pointer'}`}
            />
            {!isEditing ? (
                <ButtonEdit onClick={onClick} />
            ) : (
                <ButtonValidate onClick={onValidate} />
            )}
        </>
    )
}

export default TextEdit