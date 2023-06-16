import { createContext, useState, useContext } from "react";
import { UserContext } from "./UserProvider";

export const GroupContext = createContext({});

export const GroupProvider = ({children}) => {
    const { user, pref } = useContext(UserContext);
    const [groups, setGroups] = useState(pref.services.voxchat.grupos.filter(group => group.users.includes(user._id)));
    const [grpNotRead, setGrpNotRead] = useState(0);

 

    async function loadAllMessagesGroups() {
        let grps = (context.user.email.includes('voxcity.suporte@voxcity.com.br')  )
            ? context.pref.services.voxchat.grupos : context.pref.services.voxchat.grupos.filter(grp=>grp.usuarios.includes(context.user._id))
        let groupsId = grps.map(g=>g._id)
        await ApiUsers.post('/user/myGroupsLastMessages', { groups: groupsId }).then(resp => {
            let messages = resp.data
            let newGroups = grps
            if(messages.length === 0){                
                messages = []
                newGroups = grps.map(grp =>{
                    grp.allMessages = []
                    grp.lastMessage = ""
                    return grp
                })
            }
            else {
                newGroups =newGroups.map(group => {
                    for (let i = 0; i < messages.length; i++) {
                        let lastMessage = messages[i].messagesRoll[messages[i].messagesRoll.length - 1]
                        if (messages[i].between === group._id) {
                            let counter = 0
                            group.allMessages = messages[i].messagesRoll
                            group.lastMessage ={ message: lastMessage.message, createdAt: lastMessage.createdAt }
                            group.allMessages.forEach(message => {
                                if (!message.seen.includes(context.user._id)) {
                                    counter++
                                }
                            })
                            group.unseen = counter

                        }
                    }
                    group.allMessages = group.allMessages || []
                    return group
                })
            }
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
        }).catch(err => { console.log(err) })
    }
    return (
        <GroupContext.Provider value={{}}>
            {children}
        </GroupContext.Provider>
    )
}