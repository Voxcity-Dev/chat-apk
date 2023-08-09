import React, { useState, useContext, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { UserContext } from '../../../context/UserProvider'
import { ReplyForwardingContext } from '../../../context/ReplyForwardingProvider'
import { GroupContext } from '../../../context/GroupProvider'
import { AttendanceContext } from '../../../context/AttendanceProvider'
import MessageSender from './messageSender'

export default function ForwardTo() {
    const { setForwardingMessage, forwardingMessage } = useContext(ReplyForwardingContext)
    const { contacts, user } = useContext(UserContext)
    const { groups } = useContext(GroupContext)
    const { attendances } = useContext(AttendanceContext)
    const [selectedItems, setSelectedItems] = useState([])
    const [viewType, setViewType] = useState('private')
    const [to, setTo] = useState([])

    const views = {
        private: {
            title: 'Contatos',
            data: [...contacts],
            searchType: ['nome', "email"],
            check: false
        },
        groups: {
            title: 'Grupos',
            data: [...groups],
            searchType: ['nome', "email"]
        },
        att: {
            title: 'Atendimentos',
            data: [...attendances].filter(att => att?.atendente === user?._id),
            searchType: ['telefone', "nome", "pushname"]
        }
    }

    useEffect(() => {
        setTo(selectedItems)
    }, [selectedItems])

    

    const handleCheckBoxToggle = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(el => el !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };


    function renderizarContatos({ item }) {

        return (
            <View style={styles.blocoContato}>
                <CheckBox
                    checkedColor='#9ac31c'
                    uncheckedColor='#142a4c'
                    textStyle={{ color: "#142a4c" }}
                    checked={selectedItems.includes(item)} 
                    onPress={() => handleCheckBoxToggle(item)}
                />
                {
                    item.foto ? (
                        <Image source={{ uri: item.foto }} style={styles.image} />
                    ) : (
                        <Image source={require("../../../assets/avatar2.png")} style={styles.image} />
                    )
                }
                <Text>{item.nome || item.telefone}</Text>
            </View>
        );
    }


    return (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            {forwardingMessage ? (
                <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 50, backgroundColor: "#FFF" }}>
                        <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold",color: "#142a4c", }}>Encaminhar para:</Text>
                        <Text style={{ marginRight: 10, fontSize: 18, fontWeight: "bold", color: "#00BFFF" }} onPress={() => setForwardingMessage(null)}>Cancelar</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 50, backgroundColor: "#FFF" }}>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => setViewType('private')}>
                            <Text  style={[styles.buttonText, viewType === 'private' && styles.underBorder]}>Contatos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => setViewType('groups')}>
                            <Text style={[styles.buttonText, viewType === 'groups' && styles.underBorder]}>Grupos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={() => setViewType('att')}>
                            <Text style={[styles.buttonText, viewType === 'att' && styles.underBorder]}>Atendimentos</Text>
                        </TouchableOpacity>
                        
                    </View>

                    <View style={{ flex: 1, width: '100%', height: '100%' }}>
                        <FlatList
                            data={views[viewType].data}
                            renderItem={renderizarContatos}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <MessageSender contato={to} tipo={viewType}/>
                </>
            ) : (
                null
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    blocoContato: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        padding: 10,
        backgroundColor: "#f1f1f1",
        borderWidth: 1,
        borderColor: "#142a4c",
        marginLeft: 50,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 50,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10,
    }, buttonBox: {
        width: "33.3%",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",

    },
    buttonText: {
        color: "#142a4c",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },
    underBorder: {
        color: "#142a4c",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: "#9ac31c",
    }
})