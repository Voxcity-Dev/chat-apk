import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import File from './file'
import Audio from './audio'
import MessagesMsg from './messages';


export default function Reply(props) {
    const { item, index, isSentMessage, user } = props
    const [reply, setReply] = useState({ ...item.reply })

    useEffect(() => {
        if (item.reply) {
            setReply(item.reply)
        }
    }, [item])

    let Types = {
        file: <File key={index} item={reply} isReply={true} user={user} />,
        audio: <Audio key={index} item={reply} isReply={true} user={user} />,
    };


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
        } else if (timeDiff >= 24 * 60 * 60 * 1000) {
          // Já passou mais de 24 horas
          return `${"    "}Ontem`;
        } else {
          return `${"     "}${hours}:${minutes}`;
        }
    }

    return (
        <SafeAreaView>
            <KeyboardAvoidingView>

            <View key={index} style={[styles.messageContainer,isSentMessage ? styles.sentMessage : styles.receivedMessage]} >
                <Text style={{ fontSize: 12, textAlign: 'left', marginBottom: 5,fontWeight:"bold",color:"#142a4c"}}>Resposta</Text>
                {
                    reply.msgTypo === 'text' || reply.reply ? <MessagesMsg key={index} item={reply} isReply={true} user={user} /> :
                        reply && Types[reply.msgTypo]
                }
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}>{item?.message}</Text>
                </View>

                <Text style={{ fontSize: 8, textAlign: 'right',color:'gray' }}>{formatTimestamp(item.createdAt)}</Text>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>

    )

}

const styles = StyleSheet.create({
    messageContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 8,
        maxWidth: '100%',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#EDEDED',
    }
});
