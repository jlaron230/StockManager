const FormatDate = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export default FormatDate;