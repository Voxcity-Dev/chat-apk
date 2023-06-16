import { createContext, useState, useContext } from "react";
import { UserContext } from "./UserProvider";

export const GroupContext = createContext({});

export const GroupProvider = ({children}) => {
    const { user, pref } = useContext(UserContext);



    return (
        <GroupContext.Provider value={{}}>
            {children}
        </GroupContext.Provider>
    )
}