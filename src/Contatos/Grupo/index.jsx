import React ,{ useContext, useEffect, useState }from 'react'
import { View,ScrollView,StyleSheet,Text,Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../../../context/UserProvider';

export default function GrupoList() {
    const {pref} = useContext(UserContext);
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
      if(!pref.services) return;
      let newGrupos = pref ? pref.services.voxchat.grupos : [];
      setGrupos(newGrupos);
    }, [pref])
    

  return (
    <View style={styles.container}>
        <ScrollView>
            {
                grupos ? Object.keys(grupos).map((key,index) => {
                    return <TouchableOpacity style={styles.container} key={index}>
                            {grupos[key].foto ? <Image source={{ uri: grupos[key].foto }} style={styles.image}/> : <Image source={require('../../../assets/avatar2.png')} style={styles.image}/> }
                            <Text>{grupos[key].nome}</Text>
                        </TouchableOpacity>
                }): <Text>Sem Grupos</Text>
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