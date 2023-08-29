import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { ProfessionalContext } from '../../context/ProfissionalProvider';

export default function AgendaSelecionada(props) {
    const { allCidadaos } = useContext(ProfessionalContext);
    const [items, setItems] = useState({});
    const currentYear = new Date().getFullYear();
    const inicioAgenda = `${currentYear}-01-01`
    const fimAgenda = `${currentYear}-12-31`

    LocaleConfig.locales['pt-br'] = {
        monthNames: [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julio',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
        ],
        monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Maio', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Quin', 'Sex', 'Sab'],
        today: "Hoje"
    };

    LocaleConfig.defaultLocale = 'pt-br';


    useEffect(() => {
        const newItems = {};

        if (props.agenda && props.agenda.datasMarcadas) {
            props.agenda.datasMarcadas.forEach((item) => {
                const data = item.data.split('T')[0]; // Obtém a data no formato 'YYYY-MM-DD'
                const hora = item.data.split('T')[1].split('.')[0]; // Obtém a hora no formato 'HH:mm'

                if (!newItems[data]) {
                    newItems[data] = [];
                }
                let cidadaoNome = ''
                let cidadaoTelefone = ''
                if (item.usuario) {
                    for (let i = 0; i < allCidadaos.length; i++) {
                        if (item.usuario === allCidadaos[i]._id) {
                            cidadaoNome = allCidadaos[i].nome
                            cidadaoTelefone = allCidadaos[i].telefone
                        } else if (item.status === 'bloqueio') {
                            cidadaoNome = 'Horario Bloqueado'
                        }
                    }
                }

                newItems[data].push({ status: item.status, time: hora, name: cidadaoNome, telefone: cidadaoTelefone });
                //realizar o .sort para ordenar os horarios
                newItems[data].sort(function (a, b) {
                    if (a.time < b.time) {
                        return -1;
                    }
                    if (a.time > b.time) {
                        return 1;
                    }
                    return 0;
                }
                );
            });
        }

        setItems(newItems);
    }, [props.agenda]);

    return (
        <View style={styles.container}>
            {items ? (
                <Agenda
                    pastScrollRange={10}
                    futureScrollRange={10}
                    minDate={inicioAgenda}
                    maxDate={fimAgenda}
                    showOnlySelectedDayItems={true}
                    items={items}
                    selected={'2023-08-28'}
                    renderItem={(item, firstItemInDay) => {
                        return (
                            <View style={styles.itemContainer}>
                                <View style={{flexDirection:"row"}}>
                                    <View style={{ width: "20%",height:"100%" }}>
                                        <Text style={styles.itemTime}>{item.time} - </Text>
                                    </View>
                                    <View style={{ flexDirection: "row",gap:10,alignItems:"center" }}>
                                        <Text style={styles.itemTime}>{item.name}</Text>
                                        <Text style={styles.itemTime}>{item.telefone}</Text>
                                    </View>
                                </View>
                                <Text style={styles.itemStatus}>{item.status === 'bloqueio' ? '' : item.status}</Text>
                            </View>
                        );
                    }}
                    renderEmptyDate={() => {
                        return <View />;
                    }}
                    rowHasChanged={(r1, r2) => {
                        return r1.text !== r2.text;
                    }}
                    renderDay={(day, item) => {
                        return <View />;
                    }}
                    theme={{
                        calendarBackground: 'white',
                        agendaKnobColor: 'blue',
                        selectedDayBackgroundColor: '#142a4c',
                        selectedDayTextColor: '#9ac31c',
                        todayTextColor: 'red',
                        dayTextColor: 'black',
                        textMonthFontWeight: 'bold',
                    }}
                    renderEmptyData={() => {
                        return <View style={styles.itemContainer}><Text style={styles.itemTime}>Não há Agendamentos para este dia.</Text></View>;
                    }}

                />

            ) : (
                <Text>Não há agendas</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        width: '100%',
    },
    itemContainer: {
        alignItems: 'flex-start',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        height:70,
    },
    itemTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#142a4c',
    },
    itemStatus: {
        fontSize: 14,
        color: '#142a4c',
        marginLeft:"20%"
    },
});