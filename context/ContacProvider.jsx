import { createContext, useState,useCallback, useEffect,useContext } from "react";
import { UserContext } from "./UserProvider";

export const ContactContext = createContext({});

export const ContacProvider = ({children}) => {
    const { user, socket,contacts,setContacts } = useContext(UserContext);
    const [selectedContact, setSelectedContact] = useState(null);

    const lastMsgCont = useCallback(data => {
        // if (data.msg.from !== user._id) {
        //     let notify = document.getElementById('noti-sound')
        //     //notify.play()
        // }
        let lastMessage = data.msg
        let conts = [...contacts].map(contact => {
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
    }, [contacts, user])

    function initSocket() {
        console.log('iniciando socket')
        socket.on("lastMsg Cont", data => {
            lastMsgCont(data)
        })
    }

    function socketsOff() {
        socket.off("lastMsg Cont")
    }

    useEffect(() => {
        console.log("sockets contacts")
        initSocket()
        return () => {
            socketsOff()
        }
    }, [])

    return (
        <ContactContext.Provider value={{selectedContact,setSelectedContact}}>
            {children}
        </ContactContext.Provider>
    )
}