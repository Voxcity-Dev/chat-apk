import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Icon } from '@rneui/themed';
export default function Atendentes(props) {
    const { attendances, searchList, transferContactToAtendente,styles } = props;
    return (
        <ScrollView style={{ width: "100%", height: "30%" }}>
            {

                searchList?.length >0 ?  searchList.map((atendente, index) => {
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
                }) : attendances.map((atendente, index) => {
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
