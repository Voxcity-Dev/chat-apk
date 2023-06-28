import React,{useContext,useEffect,useState} from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView,Image } from 'react-native';
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
        apiUser.post("/atendimentos/waiting", { contact: newContact, grupo }).then((res) => {
            console.log(res.data);
            alert("Contato transferido para a lista de espera do grupo " + grupo.nome + " com sucesso!");
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
            <Text style={styles.text}>Selecione um Atendente:</Text>
            <ScrollView style={{ width: "100%",height:"30%" }}>
                {
                    attendances?.map((atendente, index) => {
                        return (
                            <View key={index} style={styles.blocoContato}>
                                {
                                    atendente.foto ? (
                                        <Image source={{ uri: atendente.foto }} style={styles.image} />
                                    ) : (
                                        <Image source={require("../../../assets/avatar2.png")} style={styles.image} />
                                    )
                                }
                                <View style={{ flexDirection: "column"}}>
                                    <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold" }}>{atendente.nome}</Text>
                                    <Text>{atendente.departamentoNome ? atendente.departamentoNome : "Sem departamento"}</Text>
                                    <Text>{atendente.setorNome ? atendente.setorNome : "Sem setor"}</Text>
                                </View>
                                <TouchableOpacity style={{marginLeft:10}} onPress={() => transferContactToAtendente(atendente)}>
                                    <Icon name="arrow-forward-outline" type="ionicon" size={30} color={"#9ac31c"} />
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </ScrollView>

            <Text style={styles.text}>Selecione um grupo:</Text>

            <ScrollView style={{ width: "100%",height:"30%" }}>               
                {
                    groups?.map((grupo, index) => {

                        return(
                            <View key={index} style={styles.blocoContato}>
                                {
                                    grupo.foto ? (
                                        <Image source={{ uri: grupo.foto }} style={styles.image} />
                                    ) : (
                                        <Image source={require("../../../assets/avatar2.png")} style={styles.image} />
                                    )
                                }
                                <View style={{ flexDirection: "column"}}>
                                    <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold" }}>{grupo.nome}</Text>
                                </View>

                                <TouchableOpacity style={{marginLeft:10}} onPress={() => transferContactToGroup(grupo)}>
                                    <Icon name="arrow-forward-outline" type="ionicon" color={"#9ac31c"} />
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
