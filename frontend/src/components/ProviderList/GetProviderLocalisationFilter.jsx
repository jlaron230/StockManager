// 🔍 Filtre les fournisseurs selon une valeur de recherche (code postal)
// - `providers` : tableau de fournisseurs
// - `searchValue` : chaîne entrée par l'utilisateur (ex : "75001")

export const GetProviderLocalisationFilter = (providers, searchValue) => {
    // ✅ Si une valeur de recherche est saisie (non vide)
    if (searchValue.trim() !== "") {
        return providers.filter((provider) =>
            provider.code_postal.toLowerCase().includes(searchValue.toLowerCase())
        );
    } else {
        // 🟡 Si aucun filtre n'est appliqué, retourne la liste complète
        return providers;
    }
};
