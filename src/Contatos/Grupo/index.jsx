import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { GroupContext } from '../../../context/GroupProvider';

export default function GrupoList() {
  const { groups, setSelectedGroup, socketIo, unseenByGroup } = useContext(GroupContext);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    let newGroups = groups ? [...groups] : [];
    setGrupos(newGroups);
  }, [groups]);

  function handleSelectGroup(group) {
    let selectedGroup = { ...group };
    setSelectedGroup(selectedGroup);
    handleUnseenMessages(group);
  }

  function handleUnseenMessages(group) {
    grupos?.forEach((grupx) => {
      if (grupx._id === group._id) {
        let messagesRead = group.unseen;
        socketIo.emit('read cont messages', { contact: group._id, messages: messagesRead, type: 'group' });
        unseenByGroup(group._id);
        group.unseenMessages = [];
      }
    });
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - date.getTime();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    if (timeDiff >= 48 * 60 * 60 * 1000) {
      // Já passou mais de 48 horas
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
  
      return `${day}/${month}/${year}`;
    } else if(timeDiff >= 24 * 60 * 60 * 1000) {
        // Já passou mais de 24 horas
        return `Ontem`;
      } else {
        return `${"        "}${hours}:${minutes}`;
      }
  }

  function limitMessage(message) {
    if (message.length > 30) {
        return message.substring(0, 30) + '...';
    } else {
        return message;
    }
}

  return (
    <View style={styles.container}>
      <ScrollView>
        {grupos ? (
          grupos.map((grupo, index) => {
            return (
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  padding: 15,
                }}
                key={index}
                onPress={() => handleSelectGroup(grupo)}
              >
                {grupo.foto ? (
                  <Image source={{ uri: grupo.foto }} style={styles.image} />
                ) : (
                  <Image source={require('../../../assets/avatar2.png')} style={styles.image} />
                )}
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Text style={{ color: '#142a4c', fontSize: 16, fontWeight: '800' }}>{grupo.nome}</Text>
                  <View style={{ width: '55%', flexDirection: 'row', marginTop: 5,alignSelf:"flex-start" }}>
                    {grupo.lastMessage?.message !== undefined ? (
                      <Text style={styles.lastMessage}>{limitMessage(grupo.lastMessage.message)}</Text>
                    ) : (
                      <Text style={styles.lastMessage}>Inicie uma conversa.</Text>
                    )}
                    {grupo.lastMessage?.createdAt !== undefined ? (
                      <Text style={styles.lastMessage}>{formatTimestamp(grupo.lastMessage.createdAt)}</Text>
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                </View>
                {grupo.unseenMessages > 0 ? (
                  <Text style={styles.notification}>{grupo.unseenMessages}</Text>
                ) : (
                  <Text></Text>
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={{ fontSize: 18, color: '#142a4c', textAlign: 'center' }}>Sem Grupos</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    color: '#FFF',
    padding: 10,
    gap: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  notification: {
    backgroundColor: '#9ac31c',
    color: '#FFF',
    marginLeft: 10,
    borderRadius: 25,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
  lastMessage: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'gray',
    fontSize: 14,
    margin:"auto",
  },
});
