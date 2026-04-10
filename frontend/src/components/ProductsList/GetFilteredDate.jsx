// Fonction pour trier les produits selon la date d'ajout, en fonction d'un filtre
export const GetFilteredDate = (products, filteredDate) => {
    // Inversion de l'état actuel du filtre (utile pour définir l'ordre de tri)
    const newFilteredDate = !filteredDate;

    // Tri des produits en copiant le tableau d'origine
    const sorted = [...products].sort((a, b) =>
        filteredDate // Si le filtre est actif
            ? newFilteredDate // Inverse l'ordre (croissant ou décroissant)
                ? new Date(b.date_add) - new Date(a.date_add) // Tri décroissant par date
                : new Date(a.date_add) - new Date(b.date_add) // Tri croissant par date
            : new Date(a.date_add) - new Date(b.date_add) // Par défaut, tri croissant
    );

    // Renvoie le tableau trié
    return sorted;
}
