// 🗓️ Fonction utilitaire pour formater une date en chaîne lisible
// Prend une date au format string (ex: "2025-06-19") et retourne "19/06/2025" (ou selon la locale)
// Par défaut, utilise le format français 'fr-FR'

const FormatDate = (dateString, locale = 'fr-FR') => {
    // On convertit la chaîne de date en objet Date JavaScript
    const date = new Date(dateString);

    // On retourne la date formatée selon la locale choisie
    return date.toLocaleDateString(locale, {
        year: 'numeric',     // Affiche l'année complète (ex: 2025)
        month: '2-digit',    // Affiche le mois sur 2 chiffres (ex: 06)
        day: '2-digit',      // Affiche le jour sur 2 chiffres (ex: 19)
    });
};

export default FormatDate;
