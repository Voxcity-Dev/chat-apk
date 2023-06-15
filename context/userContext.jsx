import { createContext, useState } from "react";
import apiUser from "../apiUser";


export const userContext = createContext({});

export const UserProvider = ({children}) => {
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState({});
    const [pref, setPref ] = useState({});
    const [loading, setLoading] = useState(false);

    const Logar = async (email,senha,conta) => {
        setLoading(true);
        await apiUser.post('/login', {email,senha,conta})
        .then((response) => {
            if(response.data.error){
                alert(response.data.error);
                setLoading(false);
            }else{
                setUser(response.data.user);
                setPref(response.data.pref);
                setSigned(true);
                setLoading(false);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const Deslogar = () => {
        setUser({});
        setSigned(false);
    }



    return(
        <userContext.Provider value={{signed, user, setUser,Logar,Deslogar,loading,pref}}>
            {children}
        </userContext.Provider>
    );
}