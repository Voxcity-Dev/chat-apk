import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, FlatList, Image } from 'react-native';
import { ddd } from '../../utils/dddList'
import { Picker } from '@react-native-picker/picker';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { useNavigation } from '@react-navigation/native';
import { Icon } from "@rneui/themed";
import apiUser from '../../../apiUser';

export default function AdicionarContato({ selectedBot }) {
    const attendanceContext = useContext(AttendanceContext);
    const [numero, setNumero] = useState('');
    const [selectedDDD, setSelectedDDD] = useState('');
    const [dddList, setDddList] = useState([]);
    const [error, setError] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        let newDDDList = Object.entries(ddd).map(([value, label]) => ({ value, label }));
        setDddList(newDDDList);
    }, [ddd]);

    useEffect(() => {
        if (numero.length === 0) {
            setError('');
        } else if (numero.length < 8 || numero.length > 9) {
            setError('Número inválido');
        } else {
            setError('');
        }
    }, [numero]);

    useEffect(() => {
        if (selectedDDD.length > 0 && numero.length > 2) {
            let telefone = `55${selectedDDD}${numero}`;
            let newContacts = attendanceContext.instancesContactsList.filter((contact) => {
                let val = contact.telefone;
                return val.toLowerCase().includes(telefone.toLowerCase());
            });
            setFilteredContacts(newContacts);
        }
    }, [numero]);

    const handleAddContato = () => {
        if (selectedDDD.length === 0) {
            Alert.alert('Atenção', 'Selecione um DDD');
            return;
        }
        if (numero.length < 8 || numero.length > 9) {
            Alert.alert('Atenção', 'Número inválido');
            return;
        }
        if (!selectedBot || selectedBot.length === 0) {
            Alert.alert('Atenção', 'Selecione um bot');
            return;
        }
        let telefone = `55${selectedDDD}${numero}`;
        let contato = {
            telefone: telefone,
            bot: selectedBot
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

    const handleAddContatoFromList = (item) => {
        if (item && item.telefone) {
            const telefone = item.telefone.toString();
            const numero = telefone.split('55')[1];
            setNumero(numero.slice(2));
        } else {
            console.error('Item ou telefone indefinido:', item);
        }
    }


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 10 }}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                    <View style={styles.pickerStyle}>
                        <Picker selectedValue={selectedDDD} onValueChange={(itemValue) => setSelectedDDD(itemValue)} >
                            <Picker.Item label="DDD" value="" />
                            {dddList.map((ddd) => {
                                return (
                                    <Picker.Item key={ddd.value} label={ddd.value} value={ddd.value} />
                                )
                            })}
                        </Picker>
                    </View>
                    <View style={{ width: '62%' }}>
                        <TextInput
                            style={styles.TextInputS}
                            placeholder="Número"
                            keyboardType="numeric"
                            value={numero}
                            onChangeText={setNumero}
                        />

                        <Text style={{ color: "red", fontSize: 12, fontWeight: "bold", position: 'absolute', bottom: -20 }}>{error}</Text>
                    </View>

                </View>

            </View>

            <TouchableOpacity onPress={handleAddContato} style={{ backgroundColor: "#142a4c", padding: 10, borderRadius: 5, width: 200, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Adicionar</Text>
            </TouchableOpacity>

            {
                numero && filteredContacts.length > 0 ? (
                    <FlatList
                        data={filteredContacts}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleAddContatoFromList(item)} style={styles.contactBox}>
                                {item.foto ?
                                    <Image source={{ uri: item?.foto }} style={{ width: 37, height: 37, borderRadius: 50 }} />
                                    : <Image style={{ width: 37, height: 37, borderRadius: 50 }} source={require('../../../assets/avatar2.png')} />
                                }
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '70%' }}>
                                    <Text style={styles.contactText}>{item?.nome ? item?.nome : item?.pushname}</Text>
                                    <Text style={styles.contactText}>{item?.telefone}</Text>
                                </View>
                                <Icon type='ionicon' name='chatbox-ellipses-sharp' color='#9ac31c' size={30} />
                            </TouchableOpacity>
                        )}
                    />
                ) : (

                    <View style={{ width:'100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={styles.text}>Para adicionar um contato para um novo atendimento selecione um bot e adicione o ddd + numero válido nos campos acima.</Text>
                        <Text style={styles.text}>A lista de contatos será exibida apos a escolha do ddd e ser digitado 3 numeros.</Text>
                    </View>
                )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    text: {
        fontSize: 20,
    },
    pickerStyle: {
        width: '40%',
        backgroundColor: "#f5f5f5",
        color: "#142a4c",
        marginTop: 20,
        marginLeft: 7,
        borderRadius: 5,
        alignSelf: "center",
        borderColor: "#142a4c",
        borderWidth: 1
    },
    TextInputS: {
        width: '96%',
        height: 55,
        backgroundColor: "#f5f5f5",
        color: "#142a4c",
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        borderColor: "#142a4c",
        borderWidth: 1,
        padding: 10,
    }, contactBox: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    }


});