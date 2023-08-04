import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import File from './file'
import Audio from './audio'
import MessagesMsg from './messages';
import HiddenButtons from '../hiddenButtons';


export default function Reply(props) {
    const { item, index, isSentMessage, user } = props
    const [reply, setReply] = useState({ ...item.reply })
    const [showOptions, setShowOptions] = useState(false);
    const replyCor = props.isSentMessage ? '#DCF8C6' : '#EDEDED';

    useEffect(() => {
        if (item.reply) {
            setReply(item.reply)
        }
    }, [item])

    let Types = {
        file: <File key={index} item={reply} isReply={true} user={user} />,
        audio: <Audio key={index} item={reply} isReply={true} user={user} />,
    };

    function showButtons() {
        setShowOptions(!showOptions);
    }

    return (

        <TouchableOpacity style={{ width: '100%' }} onPress={showButtons}>
            <View key={index} style={[styles.messageContainer, isSentMessage ? styles.sentMessage : styles.receivedMessage]} >
                {showOptions && (
                    <HiddenButtons replyCor={replyCor} />
                )}

                <Text style={{ fontSize: 12, textAlign: 'left', marginBottom: 5 }}>Resposta</Text>
                {
                    reply.msgTypo === 'text' || reply.reply ? <MessagesMsg key={index} item={reply} isReply={true} user={user} /> :
                        reply && Types[reply.msgTypo]
                }
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}>{item?.message}</Text>
                </View>

            </View>
        </TouchableOpacity>

    )

}

const styles = StyleSheet.create({
    messageContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        maxWidth: '80%',
        marginBottom: 8,
    },
    messageContainerReply: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        maxWidth: '80%',
        marginBottom: 8,
        backgroundColor: '#FFF'
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
