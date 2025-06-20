import ButtonValidate from "@components/Button/ButtonValidate";
import ButtonEdit from "@components/Button/ButtonEdit";
import React from "react";

const OptionsProvider = ({ value, onChange, isEditing, onClick, onValidate, options }) => {
    return (
        <>
            {isEditing ? (
                // Mode édition : affichage du select et du bouton valider
                <div className="flex gap-2 items-center">
                    <select
                        value={value}
                        onChange={onChange}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="" disabled>-- Sélectionnez un type --</option>
                        {options?.map((typeValue, index) => (
                            <option key={index} value={typeValue}>
                                {typeValue}
                            </option>
                        ))}
                    </select>
                    <button onClick={onValidate} className="text-sm bg-blue-500 text-white px-2 py-1 rounded">Valider</button>
                </div>
            ) : (
                // Mode affichage : valeur cliquable pour activer l'édition
                <div onClick={onClick} className="cursor-pointer text-blue-600">
                    {value || "Non défini"}
                </div>
            )}
        </>
    );
};
export default OptionsProvider;
