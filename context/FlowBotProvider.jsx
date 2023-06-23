import React, { useState, useContext, useEffect, createContext } from 'react';
import { UserContext } from "./UserProvider";
import apiUser from "../apiUser";


export const FlowBotContext = createContext({});

export const FlowBotProvider = ({children}) => {

    const context = useContext(UserContext);
    let initialBots = Object.keys(context.pref.services.voxbot.bots).map((f) => context.pref.services.voxbot.bots[f])
    const [bots, setBots] = useState(initialBots);
    const [random, setRandom] = useState({});
    const [sincronizando, setSincronizando] = useState(false);
    const APISocket = context.socket;

    useEffect(() => {
        APISocket.on("update bot", (bot) => updateBots(bot));
        APISocket.on("delete bot", (bot) => deleteBot(bot));
        APISocket.on("sincronizado", () => {
            setSincronizando(false)
        });
        return () => {
            APISocket.off("update bot");
            APISocket.off("delete bot");
        }
    }, [APISocket, bots, random])

 
    useEffect(() => {
        let randoms = random
        bots.forEach(bot=>{
            if(bot.status === "logando")randoms[bot._id] = new Date().getTime()
            else randoms[bot._id] = false
        })
        setRandom(randoms)

        ///UPDATE BOT DA API
        APISocket.on("update bot", (bot) => updateBots(bot));

        return () => {
            APISocket.off("update bot");
        }
    },[bots])

    // BOT ACTIONS ----------------------------------------------------------------------------------------------------------------------


    function updateBots(bot) {
        let newBots = [...bots];
        if (bots.some((b) => b._id === bot._id)) {
            newBots.forEach((f) => {
                if (f._id === bot._id) f = Object.assign(f, bot);
            });
        } else {
            newBots = [...bots, bot];
        }
        setBots(newBots)
    }

    function deleteBot(bot) {
        let newBots = bots.filter(b => b._id !== bot._id);
        setBots(newBots)
    }

    function sincronyze(bot){        
        setSincronizando(true)
        apiUser.post("/whats/sincronize", { bot}).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <FlowBotContext.Provider value={{ bots, random, sincronyze,sincronizando }}>
            {children}
        </FlowBotContext.Provider>
    );
}
