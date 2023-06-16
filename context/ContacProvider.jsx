import { createContext, useState } from "react";

export const ContactContext = createContext({});

export const ContacProvider = ({children}) => {
    const [pvtNotRead, setPvtNotRead] = useState(0);


    return (
        <ContactContext.Provider value={{setPvtNotRead,pvtNotRead}}>
            {children}
        </ContactContext.Provider>
    )
}