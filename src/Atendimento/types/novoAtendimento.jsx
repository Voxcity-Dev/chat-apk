import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Icon } from '@rneui/themed';
import { FlowBotContext } from '../../../context/FlowBotProvider';
import AdicionarContato from './adicionarContato';
import ContactList from './contactList';

export default function NovoAtendimento(props) {
    const flowBotContext = useContext(FlowBotContext);
    const [bots, setBots] = useState([]);
    const [activeButton, setActiveButton] = useState('add');
    const [selectedBot, setSelectedBot] = useState('');
    const [type, setType] = useState('add');

    useEffect(() => {
        let newBots = flowBotContext?.bots?.filter((bot) => bot.status === "ativo");
        setBots(newBots);
        if (newBots.length > 0 && !selectedBot) {
            setSelectedBot(newBots[0]._id);
        }
    }, [flowBotContext.bots]);

    const handleButtonPress = (buttonName) => {
        setActiveButton(buttonName);
        setType(buttonName);
    };

    const getButtonStyle = (buttonName) => {
        return {
            ...styles.buttonBox,
            backgroundColor: activeButton === buttonName ? '#142a4c' : '#f8f8f8',
            borderBottomWidth: activeButton === buttonName ? 2 : 0,
            borderBottomColor: activeButton === buttonName ? '#9ac31c' : '#f5f5f5',
        };
    };

    const getIconColor = (buttonName) => {
        return activeButton === buttonName ? '#fff' : '#142a4c';
    };

    const getTextColor = (buttonName) => {
        return activeButton === buttonName ? '#fff' : '#142a4c';
    };

    const views = {
        add: <AdicionarContato selectedBot={selectedBot} />,
        contacts: <ContactList selectedBot={selectedBot} />,
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity style={getButtonStyle('add')} onPress={() => handleButtonPress('add')}>
                    <Icon name="add-sharp" type="ionicon" size={25} color={getIconColor('add')} />
                    <Text style={[styles.buttonText, { color: getTextColor('add') }]}>Novo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={getButtonStyle('contacts')} onPress={() => handleButtonPress('contacts')}>
                    <Icon name="people-sharp" type="ionicon" size={25} color={getIconColor('contacts')} />
                    <Text style={[styles.buttonText, { color: getTextColor('contacts') }]}>Contatos</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.pickerStyle}>
                <Picker selectedValue={selectedBot} onValueChange={(itemValue) => setSelectedBot(itemValue)}>
                    <Picker.Item label="Selecione um bot" value="" />
                    {bots && bots.map((bot) => (
                        <Picker.Item key={bot._id} label={bot.nome} value={bot._id} />
                    ))}
                </Picker>
            </View>

            {views[type]}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 500,
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#111',
        padding: 10,
    },
    buttonBox: {
        width: "55%",
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: 10,
        margin: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    containerHeader: {
        width: "90%",
        height: 50,
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: 10,
    },
    pickerStyle: {
        width: "100%",
        backgroundColor: "#f5f5f5",
        color: "#142a4c",
        marginTop: 20,
        borderRadius: 5,
        alignSelf: "center",
        borderColor: "#142a4c",
        borderWidth: 1
    }
});
