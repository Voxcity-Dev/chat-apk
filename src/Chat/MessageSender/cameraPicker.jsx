import React from 'react';
import { TouchableOpacity, StyleSheet} from 'react-native';
import { Icon } from '@rneui/themed';


export default function CameraPicker(props) {

   

    return(

        <TouchableOpacity>
            <Icon name="camera-sharp" type="ionicon" size={25} color={"#9ac31c"} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

})