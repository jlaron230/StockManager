export const GetFilteredDate = (products, filteredDate) => {
    const newFilteredDate = !filteredDate
    const sorted = [...products].sort((a, b) =>
        filteredDate
            ? newFilteredDate
                ? new Date(b.date_add) - new Date(a.date_add)
                : new Date(a.date_add) - new Date(b.date_add)
            : new Date(a.date_add) - new Date(b.date_add)
    );
    return sorted;
}
