import React ,{ useContext, useEffect, useState }from 'react'
import { View,ScrollView,StyleSheet,Text,Image, TouchableOpacity } from 'react-native';
import { GroupContext } from '../../../context/GroupProvider';

export default function GrupoList() {
    const { groups,setSelectedGroup,socketIo,unseenByGroup } = useContext(GroupContext);
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        setGrupos(groups)
    }, [grupos])

    function handleSelectGroup(group){  
        let selectedGroup = {...group}
        setSelectedGroup(selectedGroup)
        handleUnseenMessages(group)
    }
    
    function handleUnseenMessages(group){
        grupos?.forEach(grupx => {
            if (grupx._id === group._id) {
                let messagesRead = group.unseen                                                                             
                socketIo.emit('read cont messages',{contact:group._id, messages:messagesRead ,type:"group"})
                unseenByGroup(group._id)                                        
                group.unseenMessages = []   
            }
            return group
        })
    }

  return (
    <View>
        <ScrollView>
            {
                grupos ? grupos.map((grupo,index) => {
                    return <TouchableOpacity style={styles.container} key={index} onPress={() => handleSelectGroup(grupo)}>
                            {grupo.foto ? <Image source={{ uri: grupo.foto }} style={styles.image}/> : <Image source={require('../../../assets/avatar2.png')} style={styles.image}/> }
                            <Text>{grupo.nome}</Text>
                            {
                                grupo.unseenMessages > 0 ? <Text style={styles.notification}>{grupo.unseenMessages}</Text> : <Text></Text>
                            }
                        </TouchableOpacity>
                }
                ): <Text>Sem Grupos</Text>
            }
            
        </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#FFF',
        padding: 10,
        gap: 20,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    notification:{
        backgroundColor: '#9ac31c',
        color: '#FFF',
        marginLeft: 10,
        borderRadius: 25,
        width: 20,
        height: 20,
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 14,
    }
});