import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { UserContext } from '../../../context/UserProvider';
import apiUser from '../../../apiUser';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Atendentes from './atendentes';
import Grupos from './grupos';

export default function Transferir() {
    const { selectedAtendimento, setSelectedAtendimento } = useContext(AttendanceContext);
    const { pref, user } = useContext(UserContext);
    const [attendances, setAttendances] = useState([]);
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [searchList, setSearchList] = useState([]);
    const navigation = useNavigation();
    const [setView, setSetView] = useState("atendentes");

    const views = {
        atendentes: <Atendentes attendances={attendances} searchList={searchList} transferContactToAtendente={transferContactToAtendente} styles={styles} />,
        grupos: <Grupos groups={groups} searchList={searchList} transferContactToGroup={transferContactToGroup} styles={styles} />

    }

    useEffect(() => {
        let newUsers = pref?.users.filter((att) => att.atendente && (att._id !== user._id && att.nome !== "Voxcity"));
        setAttendances([...newUsers]);
        let newGroups = pref.services.voxbot.atendentes
        setGroups([...newGroups]);
        if (setView === "atendentes") {
            let newSearchList = [...attendances] 
            if(search)newSearchList =attendances.filter((att) => att.nome.toLowerCase().includes(search.toLowerCase()));
            setSearchList([...newSearchList]);
        } else {
            let newSearchList = [...groups] 
            if(search)newSearchList =groups.filter((att) => att.nome.toLowerCase().includes(search.toLowerCase()));
            setSearchList([...newSearchList]);
        }
    }, [pref.users, user,search,setView])

    function transferContactToGroup(grupo) {
        let newContact = JSON.parse(JSON.stringify(selectedAtendimento))
        apiUser.post("/atendimentos/waiting", { contact: newContact, grupo }).then((res) => {
            console.log(res.data);
            alert("Contato transferido para a lista de espera do grupo " + grupo.nome + " com sucesso!");
        }).catch(err => console.log(err));
        setSelectedAtendimento(null)
        navigation.navigate('Atendimento')
    }

    function transferContactToAtendente(atendente) {
        let newContact = JSON.parse(JSON.stringify(selectedAtendimento))
        let newAtt = JSON.parse(JSON.stringify(atendente))
        delete newAtt.allMessages;
        delete newContact.allMessages;
        apiUser.post("/atendimentos/transfer", { contact: newContact, atendente: newAtt }).then((res) => {
            alert("Contato transferido para o atendente " + atendente.nome + " com sucesso!");
        }).catch(err => console.log(err));
        setSelectedAtendimento(null)
        navigation.navigate('Atendimento')
    }


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-around" }}>
                <TouchableOpacity onPress={() => setSetView("atendentes")}>
                    <Text style={{ color: setView === "atendentes" ? "#9ac31c" : "#142a4c", fontSize: 16, fontWeight: "bold" }}>Atendentes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSetView("grupos")}>
                    <Text style={{ color: setView === "grupos" ? "#9ac31c" : "#142a4c", fontSize: 16, fontWeight: "bold" }}>Grupos</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>Pesquise um Atendente:</Text>
            <View style={styles.searchBar}>
                <Icon name="search-outline" type="ionicon" size={30} color={"#9ac31c"} />
                <TextInput
                    style={{ width: "80%", marginLeft: 10 }}
                    placeholder="Pesquisar"
                    onChangeText={(text) => {
                        setSearch(text);
                        let newList = attendances.filter((att) => att.nome.toLowerCase().includes(text.toLowerCase()));
                        setSearchList(newList);
                    }}
                    value={search}
                />
            </View>
            {
                <>
                    {views[setView]}
                </>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: "center",
        width: "100%",
    },
    text: {
        color: "#142a4c",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        marginLeft: 10,
        width: "50%",
        borderBottomWidth: 1,
        borderColor: "#9ac31c",
        textAlign: "center"
    },
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
    },

});
