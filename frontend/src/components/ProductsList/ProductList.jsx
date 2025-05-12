import {useEffect, useState} from "react";
import Product from "@pages/Product";
import {date} from "yup";
import product from "@pages/Product";

const ProductList = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Produit 1",
            image: "https://via.placeholder.com/80", // Exemple d'image
            desc: "Body text for whatever you’d like to say...",
            price: 15,
            dateAdded: "2025-05-15"
        },
        {
            id: 2,
            name: "Produit 2",
            image: "https://via.placeholder.com/80",
            desc: "Another product description here...",
            price: 10,
            dateAdded: "2026-05-15"
        },
        {
            id: 3,
            name: "Produit 3",
            image: "https://via.placeholder.com/80",
            desc: "Another product description here...",
            price: 10,
            dateAdded: "2026-05-15"
        },
        {
            id: 4,
            name: "Produit 4",
            image: "https://via.placeholder.com/80",
            desc: "Another product description here...",
            price: 10,
            dateAdded: "2026-05-15"
        },
        {
            id: 5,
            name: "Produit 5",
            image: "https://via.placeholder.com/80",
            desc: "Another product description here...",
            price: 10,
            dateAdded: "2026-05-15"
        },
        {
            id: 6,
            name: "Produit 6",
            image: "https://via.placeholder.com/80",
            desc: "Another product description here...",
            price: 10,
            dateAdded: "2026-05-15"
        },
        {
            id: 7,
            name: "Produit 7",
            image: "https://via.placeholder.com/80",
            desc: "Another product description here...",
            price: 10,
            dateAdded: "2026-05-15"
        }
    ])

    const [filteredProduct, setFilteredProduct] = useState([]);
    const [filteredDate, setfilteredDate] = useState(true);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;



    const currentItems = filteredProduct.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);

    const productSave = (searchValue) => {
        setCurrentPage(1);
        if (searchValue.trim() !== "") {
          const result =
                products.filter((product) =>
                    product.name.toLowerCase().includes(searchValue.toLowerCase()))
            setFilteredProduct(result);
          console.log(result);
        } else {
            // Si la recherche est vide, on remet tous les produits
            setFilteredProduct(products);
        }
        }

        const filterDate = (e) => {
        const newFilteredDate = !filteredDate
        setfilteredDate(newFilteredDate);
        if(filteredDate) {
            const sorted = [...products].sort((a, b) =>
                newFilteredDate
                ? new Date(b.dateAdded) - new Date(a.dateAdded)
                : new Date(a.dateAdded) - new Date(b.dateAdded)
            )

            setFilteredProduct(sorted);
        }
        else {
            const sorted = [...products].sort((b, a) =>
                new Date(a.dateAdded) - new Date(b.dateAdded))
            setFilteredProduct(sorted);
        }
        }

        const filteredPrice = (minpriceValue, maxpriceValue) => {
        if (!minpriceValue && !maxpriceValue) {
            setFilteredProduct(products);
            return
        }

         const filterPrice = products.filter((product) => product.price > minpriceValue && product.price < maxpriceValue);
            console.log(filterPrice);
            setFilteredProduct(filterPrice);
        }

    useEffect(() => {
        setFilteredProduct(products);
    }, [products]);

    return (
        <>
        <section className=" min-h-screen flex justify-center items-start py-10">
            <div className="flex justify-center gap-20 mx-auto max-w-screen-xl">
                {/* Filtres */}
                <aside className="w-64 bg-white p-4 rounded-lg space-y-6">
                    {/* Prix */}
                    <div>
                        <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Prix</h3>
                        <div className="flex gap-2">
                            <input onChange={(e) => {
                                const value = e.target.value;
                                setMinPrice(value);
                                filteredPrice(Number(maxPrice), Number(value));
                            }} type="number" placeholder="minimum"
                                   className="w-full p-2 border rounded-md text-sm"/>

                            <input onChange={(e) =>{const value = e.target.value;
                                setMaxPrice(value);
                                filteredPrice(Number(minPrice), Number(value))}} type="number" placeholder="maximum"
                                   className="w-full p-2 border rounded-md text-sm"/>
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Type</h3>
                        <select onChange={(e) => productSave(e.target.value)}
                                className="w-full p-2 border rounded-md text-sm" defaultValue="">
                            <option value="" disabled>-- Sélectionnez un produit --</option>
                            {products.map((product) => (
                                <option value={product.name} key={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Ajouté récemment */}
                    <div className="gap-2 flex items-center justify-between flex-wrap flex-row">
                        <span
                            className="basis-52 text-gray-700 dark:text-gray-300 font-semibold">Ajouté récemment</span>
                        <label className="basis-52 relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={filterDate} className="sr-only peer"/>
                            <div
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600"></div>
                            <div
                                className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
                        </label>
                    </div>
                </aside>

                {/* Produits + Recherche */}
                <main className=" space-y-6">
                    {/* Recherche */}
                    <div className="flex justify-center">
                        <div className="relative w-1/2">
                            <input
                                type="text"
                                placeholder="Recherche"
                                className="w-full border rounded-full py-2 px-4 pr-10 text-sm"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Liste produits */}
                    {currentItems.length > 0 ? (
                        <div className="space-y-4">
                            {
                                currentItems.map((product, index) => (
                                    <ProductFiche key={index} productName={product.name} productDesc={product.desc}
                                                  productImage={product.image}/>
                                ))
                            }
                        </div>
                     ) : (
                        <div className="space-y-4">
                            {products.map((product, index) => (
                            <ProductFiche key={index} productName={product.name} productDesc={product.desc}
                                          productImage={product.image}/>
                              ))
                            }
                        </div>
                    )}

                            {/* Pagination */}
                    <div className="flex justify-center space-x-1 mt-4">
                        <button
                            className="px-3 py-1 border rounded hover:bg-gray-200"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            {"<"}
                        </button>
                        {Array.from({length: totalPages}, (_, i) => i + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded hover:bg-gray-200 ${
                                        page === currentPage
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                        <button
                            className="px-3 py-1 border rounded hover:bg-gray-200"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            {">"}
                        </button>
                    </div>
                </main>
            </div>
        </section>
        </>
    )
}

const ProductFiche = ({productName, productImage, productDesc}) => {
    return (
        <>
            {/* Liste produits */}
            <div className="space-y-4 w-150 flex flex-wrap gap-2">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
                    <img
                        src={productImage}
                        alt="Produit"
                        className="w-20 h-20 object-contain rounded"
                    />
                    <div className="ml-4 flex-1">
                        <h4 className="text-lg font-bold">{productName}</h4>
                        <p className="text-gray-500 text-sm">
                            {productDesc}
                        </p>
                        <button className="mt-2 bg-blue-700 text-white text-sm px-3 py-1 rounded">
                            voir produit
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductList