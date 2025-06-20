import React from 'react';
import ButtonEdit from "@components/Button/ButtonEdit";
import ButtonValidate from "@components/Button/ButtonValidate";

const OptionCategory = ({
                            label = "Catégorie",
                            options = [],
                            value,
                            isEditing,
                            onChange,
                            onClick,
                            onValidate
                        }) => {
    return (
        <div className="mb-4">
            {/* Si on est en mode édition */}
            {isEditing ? (
                <div className="mb-4 flex items-center gap-2">
                    {/* Liste déroulante pour choisir une option */}
                    <select
                        value={value}
                        onChange={onChange}
                        className="border px-2 py-1 rounded-md w-32 transition duration-200"
                    >
                        {options.map((opt) => (
                            <option key={opt.id_category} value={opt.id_category}>
                                {opt.nom}
                            </option>
                        ))}
                    </select>
                    {/* Bouton pour valider la modification */}
                    <ButtonValidate onClick={onValidate} />
                </div>
            ) : (
                // Mode affichage classique
                <div className="flex flex-wrap gap-2">
                    {/* Affiche le nom de la catégorie sélectionnée, ou "Non défini" */}
                    <div
                        className="cursor-pointer px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                        onClick={onClick}
                    >
                        {options.find((cat) => cat.id_category === value)?.nom || "Non défini"}
                    </div>
                    {/* Bouton pour passer en mode édition */}
                    <ButtonEdit onClick={onClick} />
                </div>
            )}
        </div>
    );
};

export default OptionCategory;
