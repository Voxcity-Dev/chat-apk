import React,{useState,useContext,useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { userContext } from '../../context/userContext';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';


export default function NavigationBar({ currentPage }) {
  const {user} = useContext(userContext);
  const [myLinks, setMyLinks] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    let pages = [];
    if(user){
      pages.push({name:"Chat Privado",icon:"person-circle-outline"})
      pages.push({name:"Chat Grupo",icon:"people-circle-outline"})
      if(user.atendente){
        pages.push({name:"Atendimento",icon:"headset-outline"})
      }
      if(user.profissional){
        pages.push({name:"Profissional",icon:"briefcase-outline"})
      }
    }
    setMyLinks(pages);
  }, [user]);

  function navigateTo(pageName) {
    navigation.navigate(pageName);
  }

  return (

    <View style={styles.barraNavegacao}>
      {myLinks && myLinks.map((page, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => navigateTo(page.name)}>
                <Icon name={page.icon} type="ionicon"  color={currentPage === page.name ? "#9ac31c" : "#111"} />
            </TouchableOpacity>
          )
      })}

    </View>

  );
}

const styles = StyleSheet.create({
barraNavegacao:{
    width:"100%",
    backgroundColor:"#f1f1f1",
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-around",
    padding:10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});
