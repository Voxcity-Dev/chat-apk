import { useContext, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import apiUser from '../../../apiUser';
import { Icon } from '@rneui/themed';
import { Alert } from "react-native";

export default function AtendimentosEspera(props) {
  const { userContext } = useContext(UserContext);
  const [showCard, setShowCard] = useState({});
  const [errorLoadingImages, setErrorLoadingImages] = useState({});
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


  function timeHasZero(time) {
    if (time < 10) return "0" + time;
    return time;
  }

  function nameInsert(att) {
    if (att.pushname) {
      return att.pushname;
    } else if (att.Nome) {
      return att.Nome;
    } else {
      return att.telefone;
    }
  }

  function countAndSlice(message) {
    if (!message) return "";
    let count = message.length;
    if (count > 20) {
      message = message.slice(0, 20);
      message = message + "...";
    }
    return message;
  }

  function showCardFunc(att) {
    setShowCard((prevState) => ({
      ...prevState,
      [att._id]: true,
    }));

    if (att.atendente) {
      ShowAlert("Atenção", "Atendimento já foi pego por outro atendente");
    }
  }

  function handleSelectedAtendimento(att) {
    let history = att.historico;
    let newContact = JSON.parse(JSON.stringify(att));
    delete newContact.allMessages;
    newContact.historico = history;
    apiUser.post("/atendimentos/pickup", { contact: newContact })
      .then((res) => {
        ShowAlert("Sucesso", "Atendimento transferido com sucesso");
      })
      .catch((err) => console.log(err));
  }

  function handleImageError(attId) {
    setErrorLoadingImages(prevState => ({ ...prevState, [attId]: true }));
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ height: "100%" }}>
        {props.atendimentos.map((att, i) => {
          const attId = att._id;
          const hasErrorLoadingImage = errorLoadingImages[attId];
          let lastHist = att?.historico[att.historico.length - 1];
          let waitingTime = new Date(lastHist?.data);
          let formatedDate = timeHasZero(waitingTime.getDate()) +
            "/" + timeHasZero(waitingTime.getMonth() + 1) +
            "/" + timeHasZero(waitingTime.getFullYear());
          let formatedTime = timeHasZero(waitingTime.getHours()) + ":" + timeHasZero(waitingTime.getMinutes());
          let redirectedGrp = userContext?.pref.services.voxbot.atendentes.find((grp) => grp._id === att.grupo);
          let attend = userContext?.pref.users.find((user) => user._id === lastHist?.user)?.nome || " Pelo Robô";
          let isCardShown = showCard[att._id] || false;

          return (
            <View style={{ width: "100%" }} key={i}>
              <TouchableOpacity style={styles.contactBox} onPress={() => showCardFunc(att)} >
                {
                  !att.foto || hasErrorLoadingImage  ? <Image source={require('../../../assets/avatar2.png')} style={styles.image} /> : <Image source={{ uri: att.foto }} style={styles.image} onError={(e) => {handleImageError(attId)}} />
                }
                <View style={styles.contactInfo}>
                  <Text style={styles.buttonText}>{nameInsert(att)}</Text>
                  <Text style={{ color: "#142a4c", fontSize: 12 }}>{countAndSlice(att.lastMessage?.message)}</Text>
                  {lastHist ? (<Text style={{ color: "#142a4c", fontSize: 8 }}> {formatedDate} às {formatedTime} Por {attend} </Text>) : null}
                  {waitingTime && redirectedGrp ? (<Text style={{ color: "#142a4c", fontSize: 10 }}>Redirecionado para {redirectedGrp.nome} às {formatedTime}{" "} de {formatedDate} Por {attend}</Text>) : null}
                </View>
              </TouchableOpacity>

              {isCardShown ? (
                <View style={styles.transferContainer}>
                  <TouchableOpacity style={styles.transferBox} onPress={() => setShowCard((prevState) => ({ ...prevState, [att._id]: false, }))}>
                    <Icon name="close-circle-outline" type="ionicon" size={25} color={"#9ac31c"} />
                    <Text style={{ color: "#142a4c", fontWeight: "bold", marginLeft: 4 }}>Cancelar</Text>
                  </TouchableOpacity>

                  {!att.atendente && (
                    <TouchableOpacity style={styles.transferBox} onPress={() => handleSelectedAtendimento(att)}>
                      <Icon name="swap-horizontal-outline" type="ionicon" size={25} color={"#9ac31c"} />
                      <Text style={{ color: "#142a4c", fontWeight: "bold", marginLeft: 4 }} >Pegar Atendimento</Text>
                    </TouchableOpacity>
                  )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FFF",
    color: "#111",
    alignItems: "center",
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
    maxWidth: "30%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
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
