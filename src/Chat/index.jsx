import React,{useState,useContext,useEffect} from 'react';
import { View } from 'react-native';
import MessageScreen from './MessageScreen/messageScreen';
import MessageSender from './MessageSender/messageSender';
import { ContactContext } from '../../context/ContacProvider';
import { GroupContext } from '../../context/GroupProvider';
import { AttendanceContext } from '../../context/AttendanceProvider';

export default function ChatComponent(props) {
  const { selectedContact,contacts } = useContext(ContactContext);
  const { selectedGroup,groups } = useContext(GroupContext);
  const { selectedAtendimento,attendances } = useContext(AttendanceContext);
  const [contato, setContato] = useState({});

  useEffect(() => {
    let newContact = {};
    if (props.tipo === 'private') {
      newContact = {...selectedContact}
    } else if (props.tipo === 'group') {
      newContact = {...selectedGroup}
    } else if (props.tipo === 'att') {
      newContact = {...selectedAtendimento}
    }
    setContato(newContact);
  }, [contacts,groups,attendances,selectedContact,selectedGroup,selectedAtendimento]);

  return (
    <View style={{ flex: 1,width:"100%",height:"100%" }}>

      <MessageScreen tipo={props.tipo} contato={contato} />
      
      <MessageSender tipo={props.tipo} contato={contato} />

    </View>
  );
}
