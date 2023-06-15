import React ,{ useContext, useEffect, useState }from 'react'
import { View,ScrollView,StyleSheet,Text,Image, TouchableOpacity } from 'react-native';
import { userContext } from '../../../context/userContext';

export default function PrivadoList() {
    const {pref} = useContext(userContext);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
      if(!pref.users) return; 
      let newUsuarios = pref.users;
      setUsuarios(newUsuarios);
    }, [pref])
    

  return (
    <View style={styles.container}>
        <ScrollView>
            {
                usuarios ? Object.keys(usuarios).map((key,index) => {
                    return <TouchableOpacity style={styles.container} key={index}>
                            {usuarios[key].foto ? <Image source={{ uri: usuarios[key].foto }} style={styles.image}/> : <Image source={require('../../../assets/avatar2.png')} style={styles.image}/> }
                            <Text>{usuarios[key].nome}</Text>
                        </TouchableOpacity>
                }): <Text>Sem Contatos</Text>
            }
            
        </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        flex: 1,
        flexDirection:"row",
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#FFF',
        margin:10,
        gap:20,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },
});