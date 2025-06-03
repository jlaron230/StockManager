import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ButtonConnexion from "@components/Button/ButtonConnexion";
import ButtonInscription from "@components/Button/ButtonInscription";
import Logo from "@components/Image/Logo";
import ButtonLogin from "@components/Button/ButtonLogin";
import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

const navigation = [
    { name: 'A propos', href: '/a-propos', current: true },
    { name: 'Produit', href: '/produit', current: false },
    { name: 'Fournisseur', href: '/fournisseur', current: false },
    { name: 'Boutique', href: '/boutique-manage', current: false },
    { name: 'Commande', href: '/commande-gestion', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const navbar = () => {
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(true);
    const [isConnect, setIsConnect] = useState(false);

    const fetchAllData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
                method: "GET",
                credentials: "include", // important pour envoyer le cookie
            });

            if (!res.ok) {
                setIsConnect(false);
                setIsAdmin(false);
                return;
            }

            const user = await res.json();

            if (user?.user) {
                setIsConnect(true);
            } else {
                setIsConnect(false);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la session :", error);
            setIsConnect(false);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        fetchAllData(); // au premier chargement
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [location.pathname]);

    return (
        <Disclosure as="nav" className="bg-white">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
                <div className="relative flex h-16 items-center justify-between ">
                    <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Logo/>
                        </div>
                    </div>
                    <div className="min-[952px]:hidden p-2">
                        <Link to="/connexion">
                        <ButtonLogin />
                        </Link>
                    </div>
                    <div
                        className=" inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:pr-0 min-[1000px]:gap-10">
                        <div className="max-[952px]:hidden">
                        <div className=" sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current ? ' text-color-picto' : 'text-color hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        </div>
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative">
                            <div>
                                <div className="max-[952px]:hidden">
                                    {isConnect ? (
                                        <Link to="/dashboard">
                                            <ButtonLogin />
                                        </Link>
                                        ) : (
                                            <>
                                    <Link to="/connexion">
                                <ButtonConnexion/>
                                    </Link>
                                    <Link to="/Inscription">
                                <ButtonInscription/>
                                    </Link>
                                            </>
                                        )}
                                </div>
                                <div className=" inset-y-0 left-0 flex items-center min-[952px]:hidden">
                                    {/* Mobile menu button*/}
                                    <DisclosureButton
                                        className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                                        <span className="absolute -inset-0.5"/>
                                        <span className="sr-only">Open main menu</span>
                                        <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden"/>
                                        <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block"/>
                                    </DisclosureButton>
                                </div>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Your Profile
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Settings
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Sign out
                                    </a>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="min-[952px]:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'text-color-picto bg-color-gray' : 'text-color bg-color-gray hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}

export default navbar;