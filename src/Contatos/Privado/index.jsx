import React ,{ useContext, useEffect, useState }from 'react'
import { View,ScrollView,StyleSheet,Text,Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import { ContactContext } from '../../../context/ContacProvider';

export default function PrivadoList() {
    const {pref,contacts,setContacts,user} = useContext(UserContext);
    const {setPvtNotRead} = useContext(ContactContext);
    const [infoContact, setInfoContact] = useState( {
        contacts: [],
        onShow: [],
        onlyOnce: false,
        loading: true,
        selected: false,
        initialized: false
    })

    useEffect(() => {
        getContacts()
    }, [contacts])


    // function unseenByContact(id) {
    //     let newContacts = contacts.map(contact => {
    //         if (contact._id === user._id) return contact
    //         if (contact._id === id) {
    //             contact.unseen = []
    //         }
    //         return contact
    //     })
    //     setContacts(newContacts)
    //     this.setState({ contacts: newContacts, onShow: newContacts }, () => {

    //     })
    //     countAllContactsTotalNotRead()
    // }

    function countAllContactsTotalNotRead() {
        let count = 0
        contacts.forEach(contact => {
            if (contact?._id === user?._id) return
            // if (this.props.selected?._id === contact?._id) contact.unseen = []
            if (contact.unseen) {
                count += contact.unseen.length
            }
        })
        setContacts(contacts)
        setInfoContact({ contacts: contacts, onShow: infoContact.onShow })
        setPvtNotRead(count)
    }

    function getContacts() {
       setInfoContact({ onShow: contacts, contacts: contacts, loading: false }, () => {
            countAllContactsTotalNotRead();
        })
    }



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