import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Icon } from '@rneui/themed';
export default function Atendentes(props) {
    const { attendances, searchList, transferContactToAtendente } = props;
    const [list, setList] = useState([]);

    useEffect(() => {
        if (searchList.length > 0) {
            setList(searchList);
        } else {
            setList(attendances);
        }
    }, [searchList, attendances]);
    return (
        <ScrollView style={{ width: "100%", height: "30%" }}>
            {

                 list?.map((atendente, index) => {
                    return (
                        <View key={index} style={styles.blocoContato}>
                            {
                                atendente.foto ? (
                                    <Image source={{ uri: atendente.foto }} style={styles.image} />
                                ) : (
                                    <Image source={require("../../../assets/avatar2.png")} style={styles.image} />
                                )
                            }
                            <View style={{ flexDirection: "column" }}>
                                <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold" }}>{atendente.nome}</Text>
                                <Text>{atendente.departamentoNome ? atendente.departamentoNome : "Sem departamento"}</Text>
                                <Text>{atendente.setorNome ? atendente.setorNome : "Sem setor"}</Text>
                            </View>
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => transferContactToAtendente(atendente)}>
                                <Icon name="arrow-forward-outline" type="ionicon" size={30} color={"#9ac31c"} />
                            </TouchableOpacity>
                        </View>
                    )
                }) 
            }
        </ScrollView>
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
