import React, {  useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Icon } from '@rneui/themed';
export default function Grupos(props) {
    const { groups,  searchList, transferContactToGroup } = props;
    const [list, setList] = useState([]);

    useEffect(() => {
        if (searchList.length > 0) {
            setList(searchList);
        } else {
            setList(groups);
        }
    }, [searchList, groups]);
    
    return (
        <ScrollView style={{ width: "100%", height: "30%" }}>
            {
                searchList?.map((grupo, index) => {

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
