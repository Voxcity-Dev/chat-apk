import { createContext, useState,useEffect } from "react";
import  io  from "socket.io-client";
import apiUser from "../apiUser";
import { REACT_APP_SOCKET_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";


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

    
    const logar = async (email,senha,conta) => {
        setLoading(true);
        await apiUser.post('/login', {email,senha,conta})
        .then(async (response) => {
            if(response.data.error){
                alert(response.data.error);
                setLoading(false);
            }else{
                setApp(response.data);
                if(remindMe){
                    apiUser.get('/mobile/remember')
                        .then(resp => {
                          AsyncStorage.setItem('@VoxChatToken', resp.data.mobileToken);
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

    async function setApp(data){
        setUser(data.user);
        setPref(data.pref);
        apiUser.defaults.headers.common['authorization'] = "Bearer " + data.accessToken;
        setToken(data.accessToken);
        await loadMessagesAndSetContacts(data.pref.users,data.user)
        setSigned(true);
        setLoading(false);
    }

    const deslogar = async () => {
        setUser({});
        setSigned(false);
        await AsyncStorage.removeItem('@VoxChatToken');
    }


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
      return () => {}
    }, [token,setSocket])


    async function loadAsyncStorageContent() {
        try {
          const value = await AsyncStorage.getItem('@VoxChatToken');
          if (value !== null) {
            setToken(value);
            apiUser.defaults.headers.common['authorization'] = "Bearer " + value;
            loginWithToken(); // Chamando a função loginWithToken com o valor do token
          }
        } catch (error) {
          console.log('Error reading AsyncStorage:', error);
        }
    }
    

    async function loginWithToken() {
        setLoading(true);
        try {
            // Fazer a chamada para a API passando o token
            const response = await apiUser.post('/mobile/login');
            // Verificar se a resposta da API contém dados de usuário e preferências
            if (response.data.user && response.data.pref) {
                // Se sim, atualizar os estados globais de usuário e preferências
                setApp(response.data);
            } else {
                // Se a resposta não contém os dados necessários, fazer o logout
                deslogar();
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadAsyncStorageContent();
    },[])

   
    return(
        <UserContext.Provider value={{signed, user, setUser,logar,deslogar,loading,pref,contacts,setContacts,token,socket,setSocket,remindMe,setRemindMe}}>
            {children}
        </UserContext.Provider>
    );
}