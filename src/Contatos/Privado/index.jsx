import React ,{ useContext, useEffect, useState }from 'react'
import { View,ScrollView,StyleSheet,Text,Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import { ContactContext } from '../../../context/ContacProvider';

export default function PrivadoList() {
    const userContext = useContext(UserContext);
    const {setPvtNotRead} = useContext(ContactContext);
    
    const [contacts, setContacts] = useState([])
    const [onShow, setOnShow] = useState([])
    const [onlyOnce, setOnlyOnce] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(false)
    const [initialized, setInitialized] = useState(false)


    useEffect(() => {
        setContacts(userContext.contacts)
    }, [contacts])




  return (
    <View style={styles.container}>
        <ScrollView>
            {
                infoContact.onShow ? infoContact.onShow.map((contact,index) => {
                    if (user._id === contact._id) return null
                    return <TouchableOpacity style={styles.container} key={index}>
                            {contact.foto ? <Image source={{ uri: contact.foto }} style={styles.image}/> : <Image source={require('../../../assets/avatar2.png')} style={styles.image}/> }
                            <Text>{contact.nome}</Text>
                            {
                                contact.unseen && contact.unseen.length > 0 ? <Text style={styles.notification}>{contact.unseen.length}</Text> : <Text></Text>
                            }
                        </TouchableOpacity>
                }
                ): <Text>Sem Contatos</Text>
            }
            
        </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        flex: 1,
        flexDirection:"row",
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#FFF',
        margin:10,
        gap:20,
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