import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from '@rneui/themed'

export default function ReplyMessage(props) {
    const { replyMessage, setReplyMessage } = props
    const [reply, setReply] = useState(null)


    useEffect(() => {
        if (replyMessage) {
            setReply(replyMessage)
        }
        else setReply(null)
        
    }, [replyMessage])

    function limitText(text) { 
        if (text.length > 100) {
            return text.substring(0, 100) + '...'
        }
        else return text
    }
    
    if (reply) {
        return (
            <View style={styles.reply} >
                <View style={styles.messageContainer}>
                    <Text style={{color:"#142a4c",fontWeight:"bold"}}>{reply?.fromUsername}</Text>
                    <Text>{limitText(reply?.message)}</Text>
                </View>
                
                <Icon name="trash-outline" type="ionicon" style={{marginRight:10}} color={"#9ac31c"} onPress={() => setReplyMessage(null)} />

            </View>
        )
    }
    else return <></>
}   

const styles = StyleSheet.create({
    reply:{
        position: "absolute",
        bottom: 50,
        left: 1,
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "104%",
        backgroundColor: "gray",
    },
    messageContainer: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 12,
        maxWidth: '80%',
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: '#FFF',
        marginLeft: 10,
    }
})
