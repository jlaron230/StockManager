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

    const HandleClick = () => {
        setIsClicked(!IsClicked);
    }

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
            const updatedData = {...provider};

            switch (field) {
                case "email":
                    updatedData.email = email;
                    break;
                case "telephone":
                    updatedData.telephone = telephone;
                    break;
                case "commentaire":
                    updatedData.id_category = commentaire;
                    break;
                case "type":
                    updatedData.type = selectedProvider;
                    break;
                default:
                    setLoading(false);
                    return;
            }
            const providerPut = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/providers/${id}`, updatedData, {
                withCredentials: true,
            })

            console.log(providerPut.data);
        } catch (error) {
            console.error("Erreur lors de la modification du produit :", error);
        } finally {
            setLoading(false);
        }
    }

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
                                            {[...new Set(categoryList.map((type) => type.type))].map((typeOption, index) => (
                                                <option key={index} value={typeOption}>{typeOption}</option>
                                            ))}
                                        </select>
                                        <button
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
                                    <ModalProduct  nameModal="Supprimer le fournisseur" descriptionModal="Êtes-vous sûr de vouloir supprimer le fournisseur ?" supp={HandleSupp} modalOpen={IsClicked} setModalOpen={setIsClicked}/>
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