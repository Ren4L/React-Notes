import React, {FC} from 'react';
import {BrowserRouter} from "react-router-dom";
import {Router} from "@components";
import { initDB } from "react-indexed-db-hook";

const DBConfig = {
    name: "db",
    version: 1,
    objectStoresMeta: [
        {
            store: "notes",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "content", keypath: "content", options: { unique: false } },
            ],
        },
    ],
};
initDB(DBConfig);

const App:FC = () => {
    return (
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    );
};

export default App;