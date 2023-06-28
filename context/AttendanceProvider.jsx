import { createContext, useState,useCallback, useEffect,useContext } from "react";
import { UserContext } from "./UserProvider";
import apiUser from "../apiUser";



export const AttendanceContext = createContext({});

export const AttendanceProvider = ({children}) => {
    const context = useContext(UserContext);
    const [atendentes, setAtendentes] = useState(context.pref.services.voxbot.atendentes);
    const [attendances, setAttendances] = useState([...context.pref.services.voxbot.contatos]);
    const [myHistoric, setMyHistoric] = useState([]);
    const [waitingAttendances, setWaitingAttendances] = useState([]);
    // const flowBotContext = useContext(FlowBotContext);
    const userSocket = context.socket;
    const [myWaitingAtt, setMyWaitingAtt] = useState([]);
    const [selectedAtendimento, setSelectedAtendimento] = useState(null);

    useEffect(() => {
        loadAttsAndMessages();
    }, []);

    useEffect(() => {
        let newWaitingAtt = [];
        atendentes.forEach(grp => { 
            attendances.forEach((att) => {
                if(att.grupo === grp._id && att.waiting) {
                    newWaitingAtt.push({ grupo: grp._id, contato: att});
                }
            })
        });
        setWaitingAttendances(newWaitingAtt);
    }, [attendances])

    useEffect(() => {
        console.log("attendances socket");
        initSockEvents();
        return () => {  setOff() }
    }, []);


    function getMyWaitingAtt(){
        if(!context.user.admin){
            let mygroups = atendentes.filter((grp) => grp.usuarios.includes(context.user._id));
            let myattswaitin = attendances.filter((att) => mygroups.some((grp) => grp._id === att.grupo) && att.waiting);
            setMyWaitingAtt(myattswaitin);
    
        }
        else{
            let myattswaitin = attendances.filter((att) => att.waiting && !att.atendente);
            setMyWaitingAtt(myattswaitin);            
        }
    }
    
    useEffect(() => {
        getMyWaitingAtt();
    },[attendances, context]);

    function initSockEvents() {
        console.log("attendances socket init");
        userSocket.on("new contact att", contact => newContactAtt(contact));
        userSocket.on("update att", contact => updateAtt(contact));
        userSocket.on("delete att", contact => deleteAtt(contact));
       
        userSocket.on("bot new message", data => receiveMessage(data));
        userSocket.on("bot new contact att", contact => newContactAtt(contact));
        
    }
    function setOff() {
        userSocket.off("new contact att")//config
        userSocket.off("update att")//config
        userSocket.off("delete att")//config

        userSocket.off("bot new message")
        userSocket.off("bot new contact att")
        userSocket.off("bot update att")
    }
    function loadAttsAndMessages() {
        apiUser.post('/user/attendancesLastMessages').then(resp => {
            let messages = resp.data || [];
            let newAttendances = [...attendances]
            if (resp.data.length === 0) {
                newAttendances = attendances.map(att => {
                    att.lastMessage = ""
                    att.allMessages = ""
                    return att
                })
            } else {
                newAttendances = [...attendances].map(att => {
                    let docMessages = messages.find(msg => att.telefone === msg.between)
                    if (docMessages) {
                        let lastMessage = docMessages.messagesRoll[docMessages.messagesRoll.length - 1]
                        att.lastMessage = { message: lastMessage.message, createdAt: lastMessage.createdAt }
                        att.allMessages = docMessages.messagesRoll
                    } else {
                        att.lastMessage = ""
                        att.allMessages = []
                    }
                    return att
                })
            }
            newAttendances.sort((a, b) => {
                if (!a.lastMessage) {
                    return 1
                }
                if (!b.lastMessage) {
                    return -1
                }
                let dateA = Date.parse(a.lastMessage.createdAt)
                let dateB = Date.parse(b.lastMessage.createdAt)
                if (dateA > dateB) {
                    return -1
                }
                if (dateA < dateB) {
                    return 1
                }
                return 0
            })
            setAttendances(newAttendances)
        })
        leftAttsMessage()
    }

    function leftAttsMessage(){
        apiUser.post('/user/attendancesLastMessages', {leftUsers:true}).then(resp => {
            let messages = resp.data || [];
            let newAttendances = [...attendances]
            if (resp.data.length === 0) {
                newAttendances = attendances.map(att => {
                    att.lastMessage = ""
                    att.allMessages = ""
                    return att
                })
            } else {
                newAttendances = attendances.map(att => {
                    let docMessages = messages.find(msg => att.telefone === msg.between)
                    if (docMessages) {
                        let lastMessage = docMessages.messagesRoll[docMessages.messagesRoll.length - 1]
                        att.lastMessage = { message: lastMessage.message, createdAt: lastMessage.createdAt }
                        att.allMessages = docMessages.messagesRoll
                    } else {
                        att.lastMessage = ""
                        att.allMessages = []
                    }
                    return att
                })
            }
            newAttendances.sort((a, b) => {
                if (!a.lastMessage) {
                    return 1
                }
                if (!b.lastMessage) {
                    return -1
                }
                let dateA = Date.parse(a.lastMessage.createdAt)
                let dateB = Date.parse(b.lastMessage.createdAt)
                if (dateA > dateB) {
                    return -1
                }
                if (dateA < dateB) {
                    return 1
                }
                return 0
            })
            setAttendances(newAttendances)
        })
    }

    const deleteAtt = useCallback((contact) => {
        let newAttendances = [...attendances].filter(att => att.telefone !== contact.telefone)
        setAttendances(newAttendances)
    },[attendances])

    const receiveMessage = useCallback((data) => {
    //     if(data.contact && data.contact.atendente == context.user._id && data.msg.from !== context.user._id) {
    //         let notify = document.getElementById('noti-sound')
    //         notify.play()
    //    }
        let objMessage = data.msg
        let newContatct = true
        let newAttendances = [...attendances].map(att => {
            if (att.telefone === data.contact.telefone) {
                att.lastMessage = { message: objMessage.message, createdAt: objMessage.createdAt }
                att.allMessages.push(objMessage)
                newContatct = false
            }
            return att
        })
        if (newContatct) {
            data.contact.lastMessage = { message: objMessage.message, createdAt: objMessage.createdAt }
            data.contact.allMessages = [objMessage]
            newAttendances = [...attendances, data.contact]
        }
        newAttendances.sort((a, b) => {
            if (!a.lastMessage) {
                return 1
            }
            if (!b.lastMessage) {
                return -1
            }
            let dateA = Date.parse(a.lastMessage.createdAt)
            let dateB = Date.parse(b.lastMessage.createdAt)
            if (dateA > dateB) {
                return -1
            }
            if (dateA < dateB) {
                return 1
            }
            return 0
        })
        setAttendances(newAttendances)
    },[attendances, context])

    const newContactAtt =useCallback((contact) => {      
        let newAttendances = [...attendances];
        if (newAttendances.some(att => att.telefone === contact.telefone)) {
            newAttendances.forEach((att) => {
                if (att.telefone === contact.telefone) att.potencial = true;
            });
        } else {
            contact.allMessages = [];
            contact.lastMessage = "";
            contact.historico = [];
            newAttendances = [...attendances, contact];
        }
        setAttendances(newAttendances);
    },[attendances])

    const  updateAtt = useCallback((contact) => {
        let newAttendances = [...attendances]   
        let mygroups = atendentes.filter(grp => grp.usuarios.includes(context.user._id))
        let oldWaiting = attendances.filter((att) => mygroups.some((grp) => grp._id === att.grupo) && att.waiting);
       
        newAttendances.forEach((att) => {
            if (att.telefone === contact.telefone) {
                att = Object.assign(att, contact);
            }
        });

        setAttendances(newAttendances);
        let newWaiting = newAttendances.filter((att) => mygroups.some((grp) => grp._id === att.grupo) && att.waiting);
        if( newWaiting.length>oldWaiting.length  ) {        
            // let notify = document.getElementById('new-att-sound')
            // notify.play()                              
        }
    },[attendances, context])

    return (
        <AttendanceContext.Provider value={{attendances, socket: userSocket,myHistoric, waitingAttendances,myWaitingAtt,selectedAtendimento,setSelectedAtendimento}}>
            {children}
        </AttendanceContext.Provider>
    )
}
