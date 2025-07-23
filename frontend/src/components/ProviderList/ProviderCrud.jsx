import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import formatDate from "@services/FormatDate";
import ButtonReturn from "@components/Button/ButtonReturn";
import ImageEffect from "@components/Button/ImageEffect";
import InputEdit from "@components/Button/InputEdit";
import TextEdit from "@components/Button/TextEdit";
import {BellIcon} from "@heroicons/react/24/outline";
import OptionCategory from "@components/Button/OptionCategory";
import OptionText from "@components/Button/OptionText";
import ButtonSupp from "@components/Button/ButtonSupp";
import ModalProduct from "@components/ProductsList/ModalProduct";
import {set} from "husky";
import OptionsProvider from "@components/Button/OptionsProvider";
import InputEditText from "@components/Button/InputEditText";

const ProviderCrud = () => {
    let navigate = useNavigate();
    const {id} = useParams();
    const [isConnect, setIsConnect] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);
    const [provider, setProvider] = useState([]);
    const [providerTypeList, setProviderTypeList] = useState([]);
    const [productList, setproductList] = useState([]);
    const [dateArray, setDateArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState({
        email: false,
        telephone: false,
        type: false,
        commentaire: false,
    });
    const [categoryList, setCategoryList] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [type, setType] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState([]);
    const [adresse, setAdresse] = useState("");
    const [codePostal, setcodePostal] = useState("");
    const [commentaire, setCommentaire] = useState("");
    const [IsClicked, setIsClicked] = useState(true);
    const [providerTypes, setProviderTypes] = useState([]);
console.log(productList)
    const validators = {
        email: (val) => /\S+@\S+\.\S+/.test(val),
        telephone: (val) => /^0\d{9}$/.test(val),
        type: (val) => val && val.trim().length > 0,
    };

    const HandleClick = () => {
        setIsClicked(!IsClicked);
    }

    useEffect(() => {
        const fetchProviderTypes = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/provider-types`, { withCredentials: true });
                setProviderTypes(res.data);

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/provider/${id}`, { withCredentials: true });
                setproductList(response.data);
            } catch (error) {
                console.error("Erreur en récupérant les types de fournisseur :", error);
            }
        };
        fetchProviderTypes();
    }, []);

    const HandleSupp = async (e) => {
        try {
            const providerRes = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/providers/${id}`,
                {withCredentials: true,});
            console.log(providerRes);
            navigate('/fournisseur');
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const providerRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers/${id}`, {withCredentials: true});
                setProvider(providerRes.data);
                setName(providerRes.data.nom);
                setEmail(providerRes.data.email);
                setTelephone(providerRes.data.telephone);
                setProviderTypeList(providerRes.data.type);
                setAdresse(providerRes.data.adresse);
                setcodePostal(providerRes.data.code_postal);
                setCommentaire(providerRes.data.commentaire);

                setSelectedProvider(providerRes.data.type || "");
                console.log(providerRes.data)

                const providerTypeListRes =  await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, {withCredentials: true});
                setCategoryList(providerTypeListRes.data);

            } catch (error) {
                console.error("Erreur lors du chargement du produit :", error);
            }
        };

        fetchProvider();
    }, [id]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie
        })
            .then((res) => {
                if (!res.ok) {
                    setIsConnect(false);
                    navigate("/connexion");
                    // Si non connecté, on redirige vers l'accueil
                } else {
                    setIsConnect(true);
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    // Si connecté mais pas admin, on redirige aussi
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                }
                // Sinon, laisser l'accès à la page
            })
    }, []);

    const handlePut = async (field) => {
        try {
            setLoading(true);
            const updatedData = { ...provider };
            let newValue;

            switch (field) {
                case "email":
                    newValue = email;
                    if (!validators.email(newValue)) return alert("Email invalide, exemple : johndoe@mail.com");
                    updatedData.email = newValue;
                    break;
                case "telephone":
                    newValue = telephone;
                    if (!validators.telephone(newValue)) return alert("Téléphone invalide, exemple : +09 21 34 54 45");
                    updatedData.telephone = newValue;
                    break;
                case "commentaire":
                    newValue = commentaire;
                    updatedData.commentaire = newValue;
                    break;
                case "type":
                    newValue = selectedProvider;
                    if (!validators.type(newValue)) return alert("Type de fournisseur invalide");
                    updatedData.type = newValue;
                    break;
                default:
                    setLoading(false);
                    return;
            }

            const providerPut = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/providers/${id}`,
                updatedData,
                { withCredentials: true }
            );

            console.log(providerPut.data);
        } catch (error) {
            console.error("Erreur lors de la modification du fournisseur :", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleValidate = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: false }));
    };

    if (!provider) return <div>Chargement...</div>;


    return (
        <div className="flex justify-center">
            {isConnect && (
            <main className="">
                <div className="flex justify-start flex-col items-center">
                <Link to="/fournisseur">
                    <ButtonReturn className="flex flex-wrap"/>
                </Link>
                </div>
                <div className="flex justify-center flex-wrap m-4 gap-5">
                    <div className="max-w-3xl mx-auto p-6 gap-2.5 flex flex-wrap flex-col">
                        <h1 className="text-2xl font-bold">{provider.nom}</h1>
                        <div className="gap-2.5 flex flex-wrap flex-col">
                            <p className="text-base">Email</p>
                            {isAdmin ? (
                                <div className="flex gap-2">
                                    <>
                                        <InputEditText
                                            type="text"
                                            value={email}
                                            isEditing={editMode.email}
                                            onClick={() => handleEdit("email")}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onValidate={() => {
                                                handlePut("email");
                                                handleValidate("email");
                                            }}
                                        />
                                    </>
                                </div>
                            ) : (
                                <span className="text-blue-500 font-bold">{email}</span>
                            )}
                            <div>
                                <p className="text-base">Téléphone</p>
                                {isAdmin ? (
                                    <div className="flex gap-2">
                                    <>
                                        <InputEdit
                                            type="text"
                                            value={telephone}
                                            isEditing={editMode.telephone}
                                            onClick={() => handleEdit("telephone")}
                                            onChange={(e) => setTelephone(e.target.value)}
                                            onValidate={() => {
                                                handlePut("telephone");
                                                handleValidate("telephone");
                                            }}
                                        />
                                    </>
                                    </div>
                                ) : (
                                    <span className="text-blue-500 font-bold">{commentaire}</span>
                                )}
                            </div>
                            {productList.length > 0 ? (
                            <div>
                                <p className="text-base">Produit disponible</p>
                                {productList.map((product, index) => (
                                    <div className="flex justify-between">
                                        <p className="text-blue-500 font-bold">{product.nom}</p>
                                        <p className="text-red-500 font-bold">{product.prix_unitaire} €</p>
                                    </div>
                                ))}
                            </div>
                            ) : (
                                <span className="text-base">Aucun produit associé</span>
                            )}
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto p-6 gap-2.5 flex flex-wrap flex-col">
                        <div>
                            <p className="text-base">Type</p>
                            {isAdmin ? (
                                editMode.type ? (
                                    <>
                                        <select
                                            value={selectedProvider}
                                            onChange={(e) => setSelectedProvider(e.target.value)}
                                            className="p-2 border rounded-md"
                                        >
                                            <option value="" disabled>-- Sélectionnez un type --</option>
                                            {providerTypes.map((typeOption, index) => (
                                                <option key={index} value={typeOption}>{typeOption}</option>
                                            ))}
                                        </select>
                                        <button
                                            aria-label="Bouton de validation de fournisseur"
                                            className="text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2"
                                            onClick={() => {
                                                handlePut("type");
                                                handleValidate("type");
                                            }}
                                        >
                                            Valider
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>{selectedProvider}</span>
                                        <button
                                            aria-label="Bouton de modification de fournisseur"
                                            className="text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2"
                                            onClick={() => handleEdit("type")}
                                        >
                                            Modifier
                                        </button>
                                    </div>
                                )
                            ) : (
                                <span className="text-blue-500 font-bold">{selectedProvider}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-base">Adresse</p>
                            <p className="text-blue-500 font-bold">{provider.adresse}</p>
                        </div>
                        <div>
                            <p className="text-base">Localisation</p>
                            <p className="text-blue-500 font-bold">{provider.code_postal}</p>
                        </div>
                        <div className="max-w-3xl">
                            <div>
                                <p className="text-base">Commentaire</p>
                                {isAdmin ? (
                                    <div className="content-start max-w-3xl mx-auto gap-2.5 flex flex-wrap flex-col">
                                    <>
                                        <TextEdit type="text"
                                                  value={commentaire}
                                                  isEditing={editMode.commentaire}
                                                  onClick={() => handleEdit("commentaire")}
                                                  onChange={(e) => setCommentaire(e.target.value)}
                                                  onValidate={() => {
                                                      handlePut("commentaire");
                                                      handleValidate("commentaire");
                                                  }}/>
                                    </>
                                    </div>
                                ) : (
                                    <span className="text-blue-500 font-bold">{commentaire}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {isAdmin ? (
                    <div className="flex flex-wrap justify-center p-6 items-center">
                        <ButtonSupp NameSupp="Supprimer le fournisseur" onClick={HandleClick}/>
                        <>
                            {!IsClicked ? (
                                <div>
                                    <ModalProduct  nameModal="Supprimer le fournisseur" descriptionModal={    <>
                                        Êtes-vous sûr de vouloir supprimer le fournisseur ? Cela supprimera les <strong>produits</strong> associés à celui-ci.
                                    </>} supp={HandleSupp} modalOpen={IsClicked} setModalOpen={setIsClicked}/>
                                </div>
                            ) : (
                                <></>
                            )}
                        </>
                    </div>
                ) : (
                    <></>
                )}
            </main>
            )}
        </div>
    );
};
export default ProviderCrud