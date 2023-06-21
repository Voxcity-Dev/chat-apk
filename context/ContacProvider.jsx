import { createContext, useState,useCallback, useEffect,useContext } from "react";
import { UserContext } from "./UserProvider";

export const ContactContext = createContext({});

export const ContacProvider = ({children}) => {
    const context = useContext(UserContext);
    const [selectedContact, setSelectedContact] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useState({});
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if(context.socket){
            setSocket(context.socket)
        }
    }, [context.socket])

    useEffect(() => {
        if (context.user) {
            let newUser ={...context.user}
            setUser(newUser)
            let newContacts = [...context.contacts]
            setContacts(newContacts)
        }
    }, [context.user, context.contacts])

    const lastMsgCont = useCallback(data => {
        // if (data.msg.from !== user._id) {
        //     let notify = document.getElementById('noti-sound')
        //     //notify.play()
        // }
        let lastMessage = data.msg
        let conts = [...context.contacts].map(contact => {
            if (data.between.includes(contact._id) && contact._id !== user._id) {
                contact.lastMessage = lastMessage
                contact.allMessages.push(lastMessage)
                if (user._id !== data.from && contact.unseen !== undefined) {
                    let exist = contact.unseen.filter(unseen => { return data.msg._id === unseen._id })
                    if (exist.length === 0) {
                        contact.unseen.push(lastMessage)
                    }
                }
            }
            return contact
        })

        conts.sort((a, b) => {
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
        setContacts(conts)
    }, [context.contacts, user])

    const activeContact = useCallback(cont => {
        let newContacts = [...context.contacts].map(contact => {
            if (contact._id === cont._id) {
                contact.ativo = true
            }
            return contact
        })
        newContacts = newContacts.filter(contact => contact.ativo)
        setContacts(newContacts)
    }, [context.contacts])

    const inactiveContact = useCallback(cont => {
        let newContacts = [...context.contacts].map(contact => {
            if (contact._id === cont._id) {
                contact.ativo = false
            }
            return contact
        })
        newContacts = newContacts.filter(contact => contact.ativo)
        setContacts(newContacts)
    }, [context.contacts])

    const updateContactPic = useCallback((id, url) => {
        if (id === user._id) {
            let newUser = { ...user }
            newUser.foto = url
            setUser(newUser)
        } else {
            let newContacts = [...context.contacts].map(contact => {
                if (contact._id === id) {
                    contact.foto = url
                }
                return contact
            })
            setContacts(newContacts)
        }
    }, [context.contacts, user])

    const updateCont = useCallback(userReceived => {
        if (userReceived._id === user._id) {
            let newUser = Object.assign(user, userReceived)
            setUser(newUser)
        } else {
            let newContacts = [...context.contacts].map(contact => {
                if (contact._id === userReceived._id) {
                    contact.nome = userReceived.nome
                    contact.ramal = userReceived.ramal
                    contact.telefone = userReceived.telefone
                }
                return contact
            })
            setContacts(newContacts)
        }
    }, [context.contacts, user])

    const updateStatusCont = useCallback(data => {
        let newContacts = [...context.contacts].map(contact => {
            if (contact._id === data.user) {
                contact.status = data.status
            }
            return contact
        })
        setContacts(newContacts)
    }, [context.contacts])

    const addContact = useCallback(contact => {
        let newContacts = [...context.contacts]
        newContacts.push(contact)
        setContacts(newContacts)
    }, [context.contacts])

    function initSocket() {
        console.log("online")
        socket.on("status", data => {
            updateStatusCont(data)
        })
        socket.on("update contact", user => {
            console.log("update contact")
            updateCont(user)
        })
        socket.on("update pic", ({ id, url }) => {
            updateContactPic(id, url)
        })
        socket.on("new contact", cont => {
            addContact(cont)
        })
        socket.on("inactive contact", cont => {
            inactiveContact(cont)
        })
        socket.on("active contact", cont => {
            activeContact(cont)
        })
        socket.on("lastMsg Cont", data => {
            lastMsgCont(data)
        })
        socket.on("disconnect", () => {
            console.log("disconnected")
            setReconnectAlert(true)
        })
        socket.on("reconnect", () => {
            // setReconnectAlert(false)
            console.log("reconnected");
        })
        socket.on("connect", () => {
            console.log("connected");
        })
    }


    function socketsOff() {
        socket.off("status")
        socket.off("update contact")
        socket.off("update pic")
        socket.off("new contact")
        socket.off("inactive contact")
        socket.off("active contact")
        socket.off("lastMsg Cont")
        socket.off("new message")
    }

    useEffect(() => {
        if(socket) initSocket()
        return () => {
            if(socket) socketsOff()
        }
    }, [socket])

    return (
        <ContactContext.Provider value={{selectedContact,setSelectedContact,contacts}}>
            {children}
        </ContactContext.Provider>
    )
}