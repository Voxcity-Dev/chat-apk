import React, {  useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function Grupos(props) {
    const { groups,  searchList, transferContactToGroup,styles } = props;
    return (
        <ScrollView style={{ width: "100%", height: "30%" }}>
            {
                searchList?.length >0 ? searchList.map((grupo, index) => {

                    return (
                        <View key={index} style={styles.blocoContato}>
                            {
                                grupo.foto ? (
                                    <Image source={{ uri: grupo.foto }} style={styles.image} />
                                ) : (
                                    <Image source={require("../../../assets/avatar2.png")} style={styles.image} />
                                )
                            }
                            <View style={{ flexDirection: "column" }}>
                                <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold" }}>{grupo.nome}</Text>
                            </View>

                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => transferContactToGroup(grupo)}>
                                <Icon name="arrow-forward-outline" type="ionicon" color={"#9ac31c"} />
                            </TouchableOpacity>
                        </View>
                    )

                })
                    : groups?.map((grupo, index) => {

                        return (
                            <View key={index} style={styles.blocoContato}>
                                {
                                    grupo.foto ? (
                                        <Image source={{ uri: grupo.foto }} style={styles.image} />
                                    ) : (
                                        <Image source={require("../../../assets/avatar2.png")} style={styles.image} />
                                    )
                                }
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold" }}>{grupo.nome}</Text>
                                </View>

                                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => transferContactToGroup(grupo)}>
                                    <Icon name="arrow-forward-outline" type="ionicon" color={"#9ac31c"} />
                                </TouchableOpacity>
                            </View>
                        )

                    })
            }
        </ScrollView>
  )
}
