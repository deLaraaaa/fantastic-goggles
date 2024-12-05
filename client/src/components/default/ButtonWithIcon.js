import React from 'react';
import "../account.css";

const ButtonWithIcon = ({ onClick, name, imageSrc }) => {
    return (
        <button onClick={onClick} className="button" style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <img src={imageSrc} alt="Personalized Icon" width="32px" style={{ marginRight: '8px' }} />
            {name}
        </button>
    );
};

export default ButtonWithIcon;