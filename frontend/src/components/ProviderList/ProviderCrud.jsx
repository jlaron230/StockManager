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
            const providerRes = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/providers/${id}`);
            console.log(providerRes);
            navigate('/fournisseur');
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const providerRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers/${id}`);
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

                const providerTypeListRes =  await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`);
                setCategoryList(providerTypeListRes.data);

            } catch (error) {
                console.error("Erreur lors du chargement du produit :", error);
            }
        };

        fetchProvider();
    }, [id]);

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
            const providerPut = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/providers/${id}`, updatedData)

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
            <aside className="max-w-3xl p-6">
                <Link to="/fournisseur">
                    <ButtonReturn className="flex flex-wrap"/>
                </Link>
                <div>
                    <p>Date de création :<span> {dateArray[2]}</span></p>
                </div>
            </aside>
            <main className="flex flex-wrap">
                <div className="max-w-3xl mx-auto p-6">
                    <h1 className="text-2xl font-bold">{provider.nom}</h1>
                    <div>
                        <p>Email</p>

                        {isAdmin ? (
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
                        ) : (
                            <span>{email}</span>
                        )}
                        <div>
                            <p>Téléphone</p>
                            {isAdmin ? (
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
                            ) : (
                                <span>{commentaire}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto p-6">
                    <div>
                        <p>Type</p>
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
                                        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
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
                                        className="text-blue-500 underline text-sm"
                                        onClick={() => handleEdit("type")}
                                    >
                                        Modifier
                                    </button>
                                </div>
                            )
                        ) : (
                            <span>{selectedProvider}</span>
                        )}
                    </div>
                    <div>
                        <p>Adresse</p>
                        <p>{provider.adresse}</p>
                    </div>
                    <div>
                        <p>Localisation</p>
                        <p>{provider.code_postal}</p>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto p-6">
                    <div>
                            <p>Commentaire</p>
                            {isAdmin ? (
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
                            ) : (
                                <span>{commentaire}</span>
                            )}
                    </div>
                    {isAdmin ? (
                        <div className="max-w-3xl p-6">
                            <ButtonSupp onClick={HandleClick}/>
                            <>
                                {!IsClicked ? (
                                    <div>
                                        <ModalProduct supp={HandleSupp} modalOpen={IsClicked} setModalOpen={setIsClicked} />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </main>
        </div>
    );
};
export default ProviderCrud