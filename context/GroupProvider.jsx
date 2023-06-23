import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "./UserProvider";
import apiUser from "../apiUser";

export const GroupContext = createContext({});

export const GroupProvider = ({children}) => {
    const { user, pref, token, socket } = useContext(UserContext);
    const [groups, setGroups] = useState([...pref.services.voxchat.grupos.filter(grp => grp.usuarios.includes(user._id))]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [grpNotRead, setGrpNotRead] = useState(0);
    const socketIo = socket

    async function loadAllMessagesGroups() {
        let grps = (user.email.includes('voxcity.suporte@voxcity.com.br')  )
            ? pref.services.voxchat.grupos : pref.services.voxchat.grupos.filter(grp=>grp.usuarios.includes(user._id))
        let groupsId = grps.map(g=>g._id)
        await apiUser.post('/user/myGroupsLastMessages', { groups: groupsId }).then(resp => {
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
                                if (!message.seenBy.includes(user._id)) {
                                    counter++
                                }
                            })
                            group.unseenMessages = counter
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
        }).catch(err => { console.log(err) })
    }

    useEffect(() => {
        loadAllMessagesGroups()
    }, [token])

    function unseenByGroup(id) {
        let newGroups = groups.map(group => {
            if (group._id === id) {
                group.unseen = []
            }
            return group
        })
        setGroups(newGroups)
        countAllContactsTotalNotRead()
    }

    function findGrpAndAddNewUsers(groupId,newUsers){
        let newGroups = groups.map(group => {
            if (group._id === groupId) {
                group.usuarios = [...group.usuarios, ...newUsers]
            }
            return group
        }
        )
        setGroups(newGroups)
    }

    function findGrpAndRemoveNewUsers(groupId,newUsers){
        let newGroups = groups.map(group => {
            if (group._id === groupId) {
                group.usuarios = group.usuarios.filter(user => !newUsers.includes(user))
            }
            return group
        }
        )
        setGroups(newGroups)
    }

    function editGroup(group) {
        let newGroups = groups.map(grp => {
            if (grp._id === group._id) {
                grp = group
            }
            return grp
        })
        setGroups(newGroups)
    }

    function addGroup(group, id) {
        let newState = [...groups];
        newState.push(group);
        setGroups(newState);
    }

    function delGroup(group) {
        let newState = [...groups];
        newState = newState.filter(grp => grp._id !== group._id);
        setGroups(newState);
    }

    const countAllContactsTotalNotRead = useCallback(() => {
        let count = 0
        
        groups.forEach(contact => {
            if (contact.unseen) count += contact.unseen.length
        })
        setGrpNotRead(count)
    }, [groups])

    const newLastMsgGroup = useCallback(message => {
        // if(message.msg.from !== user._id){
        //     let notify = document.getElementById('noti-sound')
        //     notify.play()
        // }
        let to = message.between
        let newGroups = groups.map(group => {
            if (group._id === to) {
                group.lastMessage = message.msg
                group.allMessages.push(message.msg)
                let selectId = selectedGroup?._id
                if (user._id !== message.from && group.unseen !== undefined && selectId !== to) {
                    let exist = group.unseen.filter(unseen => { return message.msg._id === unseen._id })
                    if (exist.length === 0) {
                        group.unseen.push(message.msg)
                    }
                }
                let count = group.unseenMessages + 1;
                group.unseenMessages = count
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
    }, [groups, selectedGroup, user._id])

    function initSocket() {
        socketIo.on('lastMsg group', (message) => {
           newLastMsgGroup(message)
        })
        socketIo.on('new contactGroup', (group) => {
            addGroup(group)
            countAllContactsTotalNotRead()
        })
        socketIo.on('del contactGroup', (group) => {
            delGroup(group)
            countAllContactsTotalNotRead()
        })
        socketIo.on('add user to contactGroup', ( { groupId, users }) => {
            findGrpAndAddNewUsers(groupId, users)
            countAllContactsTotalNotRead()
        })
        socketIo.on('remove user from contactGroup', ( { groupId, users }) => {
            findGrpAndRemoveNewUsers(groupId, users)    
            countAllContactsTotalNotRead()
        })
        socketIo.on('update contactGroup', (group) => {
            editGroup(group)
            countAllContactsTotalNotRead()
        })
        socketIo.on('update nomeGroup', (group) => {
            editgGroupName(group._id, group.nome)
            countAllContactsTotalNotRead()
        })
    }

    function editgGroupName(id, nome) {
        let newGroups = groups.map(group => {
            if (group._id === id) {
                group.nome = nome
            }
            return group
        }
        )
        setGroups(newGroups)
    }

    useEffect(() => {
        console.log('socket groups')
        if(socketIo) initSocket()
        return () =>{
            socketIo.off('lastMsg group')
            socketIo.off('new contactGroup')
            socketIo.off('del contactGroup')
            socketIo.off('new userGroup')
            socketIo.off('remove userGroup')
            socketIo.off('editGroup')
        }
    }, [socketIo])



    return (
        <GroupContext.Provider value={{groups,setGroups,selectedGroup,setSelectedGroup,socketIo,unseenByGroup}}>
            {children}
        </GroupContext.Provider>
    )
}