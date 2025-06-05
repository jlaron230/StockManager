import React, {useState, useEffect} from "react";
import Counter from "@components/Counter";
import Navbar from "@components/Navbar/Navbar";
import HomeComponent from "@components/Home/HomeComponent";

const Home = () => {
    return (
        <div className="contents">
         <HomeComponent />
        </div>
    )
}

export default Home;