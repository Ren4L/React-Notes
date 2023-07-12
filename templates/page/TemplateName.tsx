import React, {useEffect} from 'react';
import './TemplateName.scss';

export default function TemplateName(){
    useEffect(() => {document.title = "";}, []);

    return (
        <div className="TemplateName--container">

        </div>
    );
};
