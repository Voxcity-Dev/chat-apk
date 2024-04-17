import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import { Alert } from "react-native";

export default function AtendimentosPotencial(props) {
  const [showCard, setShowCard] = useState({});
  const [errorLoadingImages, setErrorLoadingImages] = useState({});

  const navigation = useNavigation();

  const ShowAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  };

  function countAndSlice(message) {
    if (!message) return "";
    let count = message.length;
    if (count > 20) {
      message = message.slice(0, 20);
      message = message + "...";
    }
    return message;
  }

  function handleSelectedAtendimento(att) {
    let history = att.historico;
    let newContact = JSON.parse(JSON.stringify(att));
    delete newContact.allMessages;
    newContact.historico = history;
    apiUser.post("/atendimentos/pickup", { contact: newContact })
      .then((res) => {
        ShowAlert("Sucesso", "Atendimento transferido para seus Atendimentos com sucesso!");
      })
      .catch((err) => console.log(err));
  }

  function handleTransferAtendimento(att) {
    props.setSelectedAtendimento(att)
    navigation.navigate('Transferir Atendimento')
  }

  function timeHasZero(time) {
    if (time < 10) return "0" + time;
    return time;
  }

  function showCardFunc(att) {
    setShowCard(prevState => ({
      ...prevState,
      [att._id]: true,
    }));

    if (att.atendente) {
      ShowAlert("Atenção", "Atendimento já está sendo atendido por outro atendente!");
    }
  }

  function handleImageError(attId) {
    setErrorLoadingImages(prevState => ({ ...prevState, [attId]: true }));
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ height: "100%" }}>
        {props?.atendimentos.map((att, i) => {
          const attId = att._id;
          const hasErrorLoadingImage = errorLoadingImages[attId];
          let lastMsgTime = new Date(att.lastMessage.createdAt);
          let formatedDate = timeHasZero(lastMsgTime.getDate()) + "/" + (timeHasZero(lastMsgTime.getMonth() + 1)) + "/" + timeHasZero(lastMsgTime.getFullYear())
          let formatedTime = timeHasZero(lastMsgTime.getHours()) + ":" + timeHasZero(lastMsgTime.getMinutes())
          let isCardShown = showCard[attId] || false;
          return (
            <View style={{ width: "100%" }} key={i}>
              <TouchableOpacity style={styles.contactBox} onPress={() => showCardFunc(att)} >
                {
                  !att.foto || hasErrorLoadingImage ? <Image source={require('../../../assets/avatar2.png')} style={styles.image} /> : <Image source={{ uri: att.foto }} style={styles.image} onError={() => handleImageError(attId)} />
                }
                <View style={styles.contactInfo}>
                  <Text style={styles.buttonText}>{att.pushname ? att.pushname : att.telefone.replace("@c.us", " ").trim()}</Text>
                  <Text style={{ color: "#142a4c", fontSize: 12 }}>{countAndSlice(att.lastMessage.message)}</Text>
                  <Text style={{ color: "#142a4c", fontSize: 8 }}> Ultima mensagem às {formatedTime} de {formatedDate} </Text>
                </View>
              </TouchableOpacity>

              {isCardShown && !att.atendente ? (
                <View style={styles.transferContainer}>
                  <TouchableOpacity style={styles.transferBox} onPress={() => setShowCard(prevState => ({ ...prevState, [attId]: false }))}>
                    <Icon name="close-circle-outline" type="ionicon" size={25} color={"#9ac31c"} />
                    <Text style={{ color: "#142a4c", fontWeight: "bold", marginLeft: 4 }}>Cancelar</Text>
                  </TouchableOpacity>
                  <View style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "flex-start" }}>
                    <TouchableOpacity style={styles.transferBox} onPress={() => handleSelectedAtendimento(att)}>
                      <Icon name="checkmark-outline" type="ionicon" size={25} color={"#9ac31c"} />
                      <Text style={{ color: "#142a4c", fontWeight: "bold", marginLeft: 4 }} >Pegar Atendimento</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.transferBox} onPress={() => handleTransferAtendimento(att)}>
                      <Icon name="swap-horizontal-outline" type="ionicon" size={25} color={"#9ac31c"} />
                      <Text style={{ color: "#142a4c", fontWeight: "bold", marginLeft: 4 }} >Transferir Atendimento</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}

      </ScrollView>
      {
        props.atendimentos.length === 0 ? (
          <Text style={{ color: "#142a4c", fontSize: 12, marginTop: 10, marginLeft: 10, textAlign: "center" }}>Nenhum atendimento em espera</Text>) : null
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#111',
    gap: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginLeft: 10,
    marginTop: 10,
  },
  contactBox: {
    width: "100%",
    height: 80,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    color: "#142a4c",
    padding: 10,
  },
  buttonText: {
    color: "#142a4c",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  contactInfo: {
    width: "100%",
    height: 100,
    marginLeft: 20,
    marginTop: 5,
  }, transferBox: {
    width: "100%",
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  text: {
    color: "#142a4c",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#9ac31c",
    width: "50%",
  },
  transferContainer: {
    width: "39%",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    marginLeft: 80,
    marginRight: 100,
  },
  transferBox: {
    width: "100%",
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  }

});
