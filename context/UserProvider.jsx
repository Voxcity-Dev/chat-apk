import { createContext, useState,useEffect } from "react";
import  io  from "socket.io-client";
import apiUser from "../apiUser";
import { REACT_APP_SOCKET_URL } from '@env';


export const UserContext = createContext({});

export const UserProvider = ({children}) => {
    const [signed, setSigned] = useState(false);
    const [user, setUser] = useState({});
    const [pref, setPref ] = useState({});
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [token, setToken] = useState('');
    const [socket, setSocket] = useState(null);
    const [remindMe, setRemindMe] = useState(false);
    
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
                setToken(response.data.accessToken);
                await loadMessagesAndSetContacts(response.data.pref.users,response.data.user)
                setSigned(true);
                setLoading(false);
                if(remindMe){
                    apiUser.get('/mobile/remember', {
                        params: {
                          accessToken: token
                        }
                      })
                        .then(resp => {
                          console.log(resp.data);

                        })
                        .catch(err => {
                          console.log(err);
                        });
                }
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

    // function loadAttendance() {
    //     apiUser.post('/atendimentos').then(resp => {
    //         seAttendance(resp.data)
    //     }).catch(err => {} )
    // }

    function getNotRead(arrMsgs,respUser){
        let count = []      
        arrMsgs.forEach(msg => {          
            if (!msg.seenBy.includes(respUser._id)) count.push(msg)
        })
        return count
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
                                contact.allMessages = messages[i].messagesRoll
                                contact.lastMessage ={ message: lastMessage.message, createdAt: lastMessage.createdAt }
                                let count = 0
                                contact.allMessages.forEach(msg => {
                                    if (!msg.seenBy.includes(respUser._id)) count++
                                })
                                contact.unseenMessages = count
                                contact.unseen = getNotRead(contact.allMessages,respUser)
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

    useEffect(() => {
        if(token && socket === null){
            const newSocket = io.connect(REACT_APP_SOCKET_URL,{
                query:{
                        token:token
                    }
                })
            setSocket(newSocket);                    
        }  
      return () => {
    }
    }, [token,setSocket])



   
    return(
        <UserContext.Provider value={{signed, user, setUser,Logar,Deslogar,loading,pref,contacts,setContacts,token,socket,setSocket,remindMe,setRemindMe}}>
            {children}
        </UserContext.Provider>
    );
}