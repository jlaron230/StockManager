import React, {useState, useEffect} from "react";
import Counter from "@components/Counter";
import Navbar from "@components/Navbar/Navbar";
import HomeComponent from "@components/Home/HomeComponent";

const Home = () => {
    return (
        <div className="max-lg:flex max-lg:justify-center max-lg:flex-wrap">
         <HomeComponent />
        </div>
    )
}

export default Home;