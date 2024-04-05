import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, Image, TextInput, FlatList } from 'react-native';
import { Icon } from "@rneui/themed";
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { useNavigation } from '@react-navigation/native';
import apiUser from '../../../apiUser';

export default function ContactList({ selectedBot }) {
    const attendanceContext = useContext(AttendanceContext);
    const [contacts, setContacts] = useState([]);
    const [contactsFiltered, setContactsFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const navigation = useNavigation();

    const filterContacts = () => {
        let newContacts = contacts.filter((contact) => {
            let val = contact.nome ? contact.nome : contact.pushname ? contact.pushname : contact.telefone;
            return val.toLowerCase().includes(search.toLowerCase());
        });
        setContactsFiltered(newContacts);
    }

    const handleTextChange = (text) => {
        setSearch(text);
    }

    useEffect(() => {
        let newContacts = attendanceContext.instancesContactsList
        setContacts(newContacts);
    }, []);

    useEffect(() => {
        setContactsFiltered(contacts);
    }, [contacts]);


    useEffect(() => {
        filterContacts();
    }, [search]);

    const handleAddNewAttendance = (contact) => {
        if(!selectedBot || selectedBot.length === 0) {
            Alert.alert('Atenção', 'Selecione um bot');
            return;
        }
        if(!contact) {
            Alert.alert('Atenção', 'Selecione um contato');
            return;
        }

        let contato = {
            bot: selectedBot,
            telefone: contact.telefone,
        }

        apiUser.post('/aplicativo/atendimento', {contato})
        .then((response) => {
            let data = response.data;
            if(data.error) {
                Alert.alert('Erro', data.error);
            }
            if(data.message) {
                Alert.alert('Sucesso', data.message);
                navigation.navigate('Atendimento');
            }
        })
        .catch((error) => {
            console.error('Erro ao adicionar contato', error);
        });
        
    }

    const handleRenderContact = ({ item }) => {
        return (
            <View key={item._id} >
                <View style={styles.contactBox}>
                    {item.foto ?
                        <Image source={{ uri: item?.foto }} style={{ width: 37, height: 37, borderRadius: 50 }} />
                        : <Image style={{ width: 37, height: 37, borderRadius: 50 }} source={require('../../../assets/avatar2.png')} />
                    }
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems:'flex-start', width:'70%'}}>
                        <Text style={styles.contactText}>{item?.nome ? item?.nome : item?.pushname}</Text>
                        <Text style={styles.contactText}>{item?.telefone}</Text>
                    </View>

                    <Icon type='ionicon' name='chatbox-ellipses-sharp' color='#9ac31c' size={30} onPress={()=>handleAddNewAttendance(item)} />
                    
                </View>
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <TextInput style={styles.TextInputS} placeholder="Buscar contato" onChangeText={(text) => handleTextChange(text)} />

            <FlatList
                data={contactsFiltered}
                keyExtractor={(item) => item.telefone}
                renderItem={handleRenderContact}
                style={styles.pagination}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    contactBox: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    TextInputS: {
        width: '100%',
        height: 55,
        borderWidth: 1,
        borderColor: '#142a4c',
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        padding: 10,
    },
    pagination: {
        width: 360,
        height: 140,
        marginTop: 10,
        marginBottom: 10,
    },
    pageNumber: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#142a4c',
        padding: 10,
        margin: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
});
