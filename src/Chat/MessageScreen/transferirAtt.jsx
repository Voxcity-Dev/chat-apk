import React,{useContext,useEffect,useState} from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { UserContext } from '../../../context/UserProvider';
import apiUser from '../../../apiUser';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function Transferir() {
    const { selectedAtendimento, setSelectedAtendimento} = useContext(AttendanceContext);
    const { pref,user} = useContext(UserContext);
    const [attendances, setAttendances] = useState([]);
    const [groups, setGroups] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        let newUsers = pref?.users.filter((att) => att.atendente && (att._id !== user._id && att.nome !== "Voxcity"));
        setAttendances(newUsers);
        let newGroups = pref.services.voxbot.atendentes
        setGroups(newGroups);
    }, [pref.users,user]);

    function transferContactToGroup(grupo){
        let newContact = JSON.parse(JSON.stringify(selectedAtendimento))
        delete newContact.allMessages;
        apiUser.post("/atendimentos/waiting", { contact: newContact, grupo }).then((res) => {
            alert("Contato transferido para a lista de espera do grupo " + grupo.nome + " com sucesso!");
            console.log(res.data)
        }).catch(err => console.log(err));
        setSelectedAtendimento(null)
        navigation.navigate('Atendimento')

    }

    function transferContactToAtendente(atendente){
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
            <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold", marginTop: 10, marginLeft: 10 }}>Selecione um Atendente:</Text>
            <ScrollView style={{ width: "100%",height:"30%" }}>
                {
                    attendances?.map((atendente, index) => {

                        return(
                            <View key={index} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", padding: 10 }}>
                                <View style={{ flexDirection: "column"}}>
                                    <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold" }}>{atendente.nome}</Text>
                                    <Text>{atendente.departamentoNome ? atendente.departamentoNome : "Sem departamento"}</Text>
                                    <Text>{atendente.setorNome ? atendente.setorNome : "Sem setor"}</Text>
                                </View>
                                <TouchableOpacity onPress={() => transferContactToAtendente(atendente)}>
                                    <Icon name="arrow-forward-outline" type="ionicon" color={"#9ac31c"} />
                                </TouchableOpacity>
                            </View>
                        )

                    })
                }
            </ScrollView>

            <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold", marginTop: 10, marginLeft: 10 }}>Selecione um grupo:</Text>

            <ScrollView style={{ width: "100%",height:"30%" }}>               
                {
                    groups?.map((grupo, index) => {

                        return(
                            <View key={index} style={{ flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "100%", padding: 10 }}>
                                <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold" }}>{grupo.nome}</Text>
                                <TouchableOpacity onPress={() => transferContactToGroup(grupo)}>
                                    <Icon name="arrow-forward-outline" type="ionicon" color={"#142a4c"} />
                                </TouchableOpacity>
                            </View>
                        )

                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {    
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: "column",    
    },

});
