import { useContext, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { AttendanceContext } from '../../../context/AttendanceProvider';

export default function MeusAtendimentos(props) {
  const { setSelectedAtendimento } = useContext(AttendanceContext);
  const [errorLoadingImages, setErrorLoadingImages] = useState({});

  function countAndSlice(message) {
    if (!message) return '';
    let count = message.length;
    if (count > 20) {
      message = message.slice(0, 20);
      message = message + '...';
    }
    return message;
  }

  function nameInsert(att) {
    if (att.pushname) {
      return att.pushname;
    } else if (att.nome) {
      return att.nome;
    } else {
      return att.telefone;
    }
  }

  function timeHasZero(time) {
    if (time < 10) return '0' + time;
    return time;
  }

  function handleSelectedAtendimento(att) {
    setSelectedAtendimento(att);
  }

  function handleImageError(attId) {
    setErrorLoadingImages(prevState => ({ ...prevState, [attId]: true }));
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%' }}>
        {props.atendimentos.map(att => {
          const attId = att?._id;
          const hasErrorLoadingImage = errorLoadingImages[attId];
          let lastMsgTime;
          let formatedDate;
          let formatedTime;
          if (att.lastMessage) {
            lastMsgTime = new Date(att.lastMessage.createdAt);
            formatedDate =
              timeHasZero(lastMsgTime.getDate()) +
              '/' +
              timeHasZero(lastMsgTime.getMonth() + 1) +
              '/' +
              timeHasZero(lastMsgTime.getFullYear());
            formatedTime =
              timeHasZero(lastMsgTime.getHours()) +
              ':' +
              timeHasZero(lastMsgTime.getMinutes());
          }

          return (
            <TouchableOpacity
              style={styles.contactBox}
              key={attId}
              onPress={() => handleSelectedAtendimento(att)}
            >
              {!att.foto || hasErrorLoadingImage ? (
                <Image
                  source={require('../../../assets/avatar2.png')}
                  style={styles.image}
                />
              ) : (
                <Image
                  source={{ uri: att.foto }}
                  style={styles.image}
                  onError={() => handleImageError(attId)}
                />
              )}
              {
                att.lastMessage ? <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{nameInsert(att)}</Text>
                  <Text style={{ color: '#142a4c', fontSize: 12 }}>
                    {countAndSlice(att.lastMessage?.message)}
                  </Text>
                  <Text style={{ color: '#142a4c', fontSize: 12 }}>
                    {formatedDate} {formatedTime}
                  </Text>
                </View> : <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{nameInsert(att)}</Text>
                  <Text style={{ color: '#142a4c', fontSize: 12 }}>
                    Carregando...
                  </Text>
                </View>

              }
            </TouchableOpacity>
          );
        })}
        {props.atendimentos.length === 0 ? (
          <Text style={{ color: '#142a4c', fontSize: 12, textAlign: 'center' }}>
            Nenhum atendimento encontrado
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: '#FFF',
    color: '#111',
    alignItems: "center",
  },
  buttonBox: {
    width: "50%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    padding: 10,
    marginTop: 10,
    backgroundColor: "#142a4c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactTitle: {
    color: "#142a4c",
    fontSize: 16,
    fontWeight: "bold",
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
    height: 85,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    color: "#142a4c",
    padding: 5,
    marginTop: 10,
  },
  contactInfo: {
    width: "100%",
    height: 100,
    marginLeft: 20,
    marginTop: 5,
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

});