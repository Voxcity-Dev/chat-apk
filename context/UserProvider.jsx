import { createContext, useState } from "react";
import apiUser from "../apiUser";


export const UserContext = createContext({});

export const UserProvider = ({children}) => {
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState({});
    const [pref, setPref ] = useState({});
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);


    const Logar = async (email,senha,conta) => {
        setLoading(true);
        await apiUser.post('/login', {email,senha,conta})
        .then(async (response) => {
            if(response.data.error){
                alert(response.data.error);
                setLoading(false);
            }else{
                setUser(response.data.user);
                setPref(response.data.pref);
                apiUser.defaults.headers.common['authorization'] = "Bearer " + response.data.accessToken;
                await loadMessagesAndSetContacts(response.data.pref.users,response.data.user)
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

    function loadAttendance() {
        apiUser.post('/atendimentos').then(resp => {
            seAttendance(resp.data)
        }).catch(err => {} )
    }

    async function loadMessagesAndSetContacts(repscontacts,respUser){
        return await apiUser.get('/user/lastmessages').then(resp => {
                let messages = resp.data
                let contacx = []
                if(messages.length === 0){                
                    messages = []
                    contacx =repscontacts.map(contact =>{
                        contact.allMessages = []
                        contact.lastMessage = ""
                        return contact
                    })
                }else{
                    contacx = repscontacts.map(contact =>{  
                        for (let i = 0; i < messages.length; i++) {
                            let lastMessage = messages[i].messagesRoll[messages[i].messagesRoll.length - 1]
                            if (messages[i].between.includes(contact._id)) {
                                let counter = getNotRead(messages[i].messagesRoll,respUser)
                                contact.unseen = counter
                                contact.allMessages = messages[i].messagesRoll
                                contact.lastMessage ={ message: lastMessage.message, createdAt: lastMessage.createdAt }
                            }
                        }
                        contact.allMessages = contact.allMessages ? contact.allMessages : []
                        return contact
                    })
                    contacx.sort((a,b) => {
                        if(!a.lastMessage){
                            return 1
                        }
                        if(!b.lastMessage){
                            return -1
                        }
                        let dateA = Date.parse(a.lastMessage.createdAt)
                        let dateB = Date.parse(b.lastMessage.createdAt)
                        if(dateA > dateB){
                            return -1
                        }
                        if(dateA < dateB){
                            return 1
                        }
                        return 0
                    })
                }
                contacx = contacx.filter(contact => contact.ativo)              
                setContacts(contacx)
        }).catch(err => {} )
    }

    function getNotRead(arrMsgs,respUser){
        let count = []      
        arrMsgs.forEach(msg => {          
            if (!msg.seenBy.includes(respUser._id)) count.push(msg)
        })
        return count
    } 

    function isGroup(contact){
        return Object.keys(contact).includes('usuarios') ?  "Grupo":"Privado" 
    }

    function includesMyId(array){
        return array.includes(user._id)
    }

    function amITalkingTo(id){
        return talking === id
    }





    return(
        <UserContext.Provider value={{signed, user, setUser,Logar,Deslogar,loading,pref,contacts,setContacts}}>
            {children}
        </UserContext.Provider>
    );
}