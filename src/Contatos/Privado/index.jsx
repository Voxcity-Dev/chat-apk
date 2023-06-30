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

    return (
        <View style={styles.container}>
            <ScrollView>
                {contacts ? (
                    contacts.map((contact, index) => {
                        if (userContext.user._id === contact._id) return null;
                        return (
                            <TouchableOpacity
                                style={styles.container}
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
                                <Text>{contact.nome}</Text>
                                {contact.unseenMessages > 0 ? (
                                    <Text style={styles.notification}>{contact.unseenMessages}</Text>
                                ) : (
                                    <Text></Text>
                                )}
                                
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text>Sem Contatos</Text>
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
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#FFF',
        margin: 10,
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
        lineHeight: 20,
        fontSize: 14,
    },
});
