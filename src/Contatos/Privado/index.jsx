import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import { ContactContext } from '../../../context/ContacProvider';

export default function PrivadoList() {
    const userContext = useContext(UserContext);
    const contactContext = useContext(ContactContext);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        let newContacts = contactContext ? [...contactContext.contacts] : [];
        setContacts(newContacts);
    }, [contactContext.contacts]);

    function handleSelectContact(contact) {
        let selectedContact = { ...contact };
        contactContext.setSelectedContact(selectedContact);
        handleUnseenMessages(contact);
    }

    function handleUnseenMessages(contact) {
        contactContext.contacts.forEach((cont)=> {
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
            return `Ontem`;
          } else {
            return `${"        "}${hours}:${minutes}`;
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
            <ScrollView>
                {contacts ? (
                    contacts.map((contact, index) => {
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
                                    <View style={{width:"70%",flexDirection:"row",marginTop:5,alignSelf:'baseline'}}>
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
        alignSelf:"flex-end"
    },
});
