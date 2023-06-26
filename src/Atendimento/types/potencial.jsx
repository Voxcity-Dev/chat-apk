import React from 'react'
import { View,StyleSheet,Text } from 'react-native';

export default  function AtendimentosPotencial () {
  return (
   <View style={styles.container}>
      <Text style={{ color: "#142a4c", fontSize: 16, fontWeight: "bold", marginTop: 10, marginLeft: 10, textAlign:"center" }}>Atendimentos em Potencial</Text>
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
      gap:20,
    }

});