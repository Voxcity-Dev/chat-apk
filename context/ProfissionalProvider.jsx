import React, { useState, useContext, useEffect, createContext } from 'react';
import { UserContext } from "./UserProvider";
import apiUser from "../apiUser";


export const ProfessionalContext = createContext({});

export const ProfessionalProvider = ({children}) => {
    const context = useContext(UserContext);
    const [agendas, setAgendas] = useState([]);
    const [allCidadaos, setAllCidadaos] = useState([]);


    useEffect(() => {
        if(context.pref){
            receberAgendas()
            getAllCidadaos()
        }
    }, [])


    function receberAgendas(){
        let prefeitura = context.pref._id
        apiUser.post('agendas/getAgendas',{prefeitura}).then(resp=>{
            setAgendas(resp.data.agendas)
        }).catch(err=>{
            console.log(err)
        })
    };

    const getAllCidadaos = async () => {
        await apiUser.get("/agendas/getAllCidadaos")
          .then((response) => {
            setAllCidadaos(response.data.cidadaos);
          })
          .catch((error) => {
            console.log(error);
          });
    };




    return (
        <ProfessionalContext.Provider value={{ agendas,allCidadaos}}>
            {children}
        </ProfessionalContext.Provider>
    );
}
