import { createContext, useState } from "react";

export const ContactContext = createContext({});

export const ContacProvider = ({children}) => {
    const [selectedContact, setSelectedContact] = useState(null);


    return (
        <ContactContext.Provider value={{selectedContact,setSelectedContact}}>
            {children}
        </ContactContext.Provider>
    )
}