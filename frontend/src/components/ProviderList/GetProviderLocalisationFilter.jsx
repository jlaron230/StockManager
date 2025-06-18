export const GetProviderLocalisationFilter = (providers, searchValue) => {
    if (searchValue.trim() !== "") {
        return providers.filter((provider) =>
            provider.code_postal.toLowerCase().includes(searchValue.toLowerCase())
        )
    } else {
        return providers
    }
}