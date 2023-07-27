import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity,TextInput } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import { ContactContext } from '../../../context/ContacProvider';
import { Icon } from '@rneui/themed';

export default function PrivadoList() {
    const userContext = useContext(UserContext);
    const {contacts,setSelectedContact} = useContext(ContactContext);
    const [contactsList, setContactsList] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let newContacts = contacts ? [...contacts] : [];
        if(search){
            newContacts = newContacts.filter((contact) => contact.nome.toLowerCase().includes(search.toLowerCase()));
        }
        setContactsList(newContacts);

    }, [contacts, search]);

    function handleSelectContact(contact) {
        let selectedContact = { ...contact };
        setSelectedContact(selectedContact);
        handleUnseenMessages(contact);
    }

    function handleUnseenMessages(contact) {
        contacts.forEach((cont)=> {
            if (cont._id === contact._id) {
                let messagesRead = cont;
                messagesRead.unseenMessages = 0;
                userContext.socket.emit('read cont messages', { contact: cont._id, messages: messagesRead.unseen });
            }
        })
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - date.getTime();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
      
        if (timeDiff >= 48 * 60 * 60 * 1000) {
          // Já passou mais de 48 horas
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
      
          return `${day}/${month}/${year}`;
        } else if(timeDiff >= 24 * 60 * 60 * 1000) {
            // Já passou mais de 24 horas
            return `${"    "}Ontem`;
        } else {
        return `${"     "}${hours}:${minutes}`;
        }
    }

    function limitMessage(message) {
        if (message.length > 30) {
            return message.substring(0, 30) + '...';
        } else {
            return message;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#142a4c" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar"
                    placeholderTextColor="#142a4c"
                    onChangeText={(text) => setSearch(text)}
                    value={search}
                />
            </View>

            <ScrollView>
                {contactsList ? (
                    contactsList.map((contact, index) => {
                        if (userContext.user._id === contact._id) return null;

                        return (
                            <TouchableOpacity
                            style={{display:"flex",flexDirection:"row",alignItems:"center",gap:10,padding:15}}
                                key={index}
                                onPress={() => handleSelectContact(contact)}
                            >
                                {contact.foto ? (
                                    <Image source={{ uri: contact.foto }} style={styles.image} />
                                ) : (
                                    <Image
                                        source={require('../../../assets/avatar2.png')}
                                        style={styles.image}
                                    />
                                )}
                                <View style={{ display: 'flex',flexDirection:"column",justifyContent:"center" }} >
                                    <View style={{display:"flex",flexDirection:"row"}}>
                                        <Text style={{color:"#142a4c",fontSize:16,fontWeight:"800"}}>{contact.nome}</Text>

                                        {contact.unseenMessages > 0 ? (
                                            <Text style={styles.notification}>{contact.unseenMessages}</Text>
                                        ) : (
                                            <Text></Text>
                                        )}
                                    </View>
                                    <View style={{maxWidth:"75%",flexDirection:"row",marginTop:5,alignSelf:'baseline'}}>
                                        {
                                            contact?.lastMessage?.message !== undefined ?
                                            <Text style={styles.lastMessage}>{limitMessage(contact.lastMessage?.message)}</Text>: <Text style={styles.lastMessage}>Inicie uma conversa.</Text>
                                        
                                        }
                                        {
                                            contact?.lastMessage?.createdAt !== undefined ?
                                                <Text style={{fontSize:14,color:"gray"}}>{formatTimestamp(contact.lastMessage?.createdAt)}</Text>: <Text></Text>
                                        }
                                    </View>
                                </View>
                                
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text style={{fontSize:18,color:"#142a4c",textAlign:"center"}}>Sem Contatos</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth:'100%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
        padding: 5,
        gap: 20,
        alignSelf: 'center',
        alignContent: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
    notification: {
        backgroundColor: '#9ac31c',
        color: '#FFF',
        marginLeft: 10,
        borderRadius: 25,
        width: 20,
        height: 20,
        textAlign: 'center',
        fontSize: 14,
    },
    lastMessage: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: 'gray',
        fontSize: 14,
        alignSelf:"flex-end",
    },
    searchContainer: {
        width:'70%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.4,
        borderColor: '#142a4c',
        height: 40,
        borderRadius: 5,
        alignSelf: 'center',

    },
    searchInput: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: 40,
        color: '#142a4c',
        fontSize: 16,
    }
});
