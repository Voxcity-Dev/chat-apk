import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, FlatList, Image, ActivityIndicator } from 'react-native';
import { Icon } from "@rneui/themed";
import { ddd } from '../../utils/dddList'
import { Picker } from '@react-native-picker/picker';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { useNavigation } from '@react-navigation/native';
import apiUser from '../../../apiUser';

export default function AdicionarContato({ selectedBot }) {
    const attendanceContext = useContext(AttendanceContext);
    const [numero, setNumero] = useState('');
    const [selectedDDD, setSelectedDDD] = useState('');
    const [dddList, setDddList] = useState([]);
    const [error, setError] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        if (selectedDDD.length === 0) {
            Alert.alert('Atenção', 'Selecione um DDD');
            setLoading(false);
            return;
        }
        if (numero.length < 8 || numero.length > 9) {
            Alert.alert('Atenção', 'Número inválido');
            setLoading(false);
            return;
        }
        if (!selectedBot || selectedBot.length === 0) {
            Alert.alert('Atenção', 'Selecione um bot');
            setLoading(false);
            return;
        }
        let telefone = `55${selectedDDD}${numero}`;
        let contato = {
            telefone: telefone,
            bot: selectedBot
        }
        apiUser.post('/aplicativo/atendimento', { contato })
            .then((response) => {
                let data = response.data;
                if (data.error) {
                    Alert.alert('Erro', data.error);
                }
                if (data.message) {
                    Alert.alert('Sucesso', data.message);
                    navigation.navigate('Atendimento');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao adicionar contato', error);
                setLoading(false);
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
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
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
                    <View style={{ width: '68%' }}>
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


            <TouchableOpacity onPress={handleAddContato} style={{ width: '100%', backgroundColor: '#142a4c', padding: 10, alignItems: 'center' }}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#FFF', fontWeight: 600 }}>Adicionar</Text>}
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
                    <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.text}>Insira o número do contato, e clique em adicionar para adicionar uma nova conversa.</Text>
                    </View>
                )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    text: {
        width: '100%',
        fontSize: 16,
    },
    pickerStyle: {
        width: '32%',
        color: "#142a4c",
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderWidth: 0.4,
        borderColor: '#142a4c',
        height: 40,
        justifyContent: 'center',
    },
    TextInputS: {
        width: '100%',
        color: "#142a4c",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
        borderWidth: 0.4,
        borderColor: '#142a4c',
        height: 40,
        borderRadius: 5,
        paddingLeft: 10,
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