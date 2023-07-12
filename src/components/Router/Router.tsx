import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Notes} from "@pages";

export default function Router({}:{}){
    return (
        <Routes>
            <Route path='/' element={<Notes/>}/>
        </Routes>
    );
};
