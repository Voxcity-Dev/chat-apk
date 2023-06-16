import { createContext, useState, useContext } from "react";
import { UserContext } from "./UserProvider";

export const GroupContext = createContext({});

export const GroupProvider = ({children}) => {
    const { user, pref } = useContext(UserContext);
    const [groups, setGroups] = useState(pref.services.voxchat.grupos.filter(group => group.users.includes(user._id)));
    const [grpNotRead, setGrpNotRead] = useState(0);

    function countAllContactsTotalNotRead() {
        let count = 0
        
        groups.forEach(contact => {
            if (contact.unseen) count += contact.unseen.length
        })
        setGrpNotRead(count)
    }

    function newLastMsgGroup(message){
        if(message.msg.from !== user._id){
            let notify = document.getElementById('noti-sound')
            notify.play()
        }
        let to = message.between
        let newGroups = groups.map(group => {
            if (group._id === to) {
                group.lastMessage = message.msg
                group.allMessages.push(message.msg)
                let selectId = selected._id
                if (user._id !== message.from && group.unseen !== undefined && selectId !== to) {
                    let exist = group.unseen.filter(unseen => { return message.msg._id === unseen._id })
                    if (exist.length === 0) {
                        group.unseen.push(message.msg)
                    }
                }
            }
            return group
        })
        //order by last day
        newGroups.sort((a, b) => {
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
        setGroups(newGroups)
        countAllContactsTotalNotRead()
    }


    return (
        <GroupContext.Provider value={{}}>
            {children}
        </GroupContext.Provider>
    )
}