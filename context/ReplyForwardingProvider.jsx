import { createContext, useState } from "react";

const ReplyForwardingContext = createContext();
function ReplyForwardingProvider({ children }) {
    const [replyMessage, setReplyMessage] = useState(null);
    const [forwardingMessage, setForwardingMessage] = useState(null);
   

  
    const reset=()=>{
        setReplyMessage(null)
        setForwardingMessage(null)
    }

    return (
        
        <ReplyForwardingContext.Provider value={{
            replyMessage, setReplyMessage,
            forwardingMessage, setForwardingMessage,
            reset
        }}>
            {children}
        </ReplyForwardingContext.Provider>
    )
}

export { ReplyForwardingProvider, ReplyForwardingContext }
