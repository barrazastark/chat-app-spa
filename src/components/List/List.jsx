import React from "react";

import "./List.scss";

const blockName = "list-wrapper";

const List = ({ users }) => {
    return( 
        <div className={blockName}>
            <h2>Online users</h2>
            <div className={`${blockName}__users-list`}>
                {users.map( ({ name }) => <span key={name}>{name}</span> )}
            </div>
        </div>
    );
};

export default List;

