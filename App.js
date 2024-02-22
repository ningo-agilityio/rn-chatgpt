import { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { OPEN_AI_KEY, COMPLETION_MODEL, COMPLETION_API, GEN_IMAGE_API, GEN_IMAGE_MODEL } from '@env'

export default function App() {
  const [keyword, setKeyword] = useState("")
  const [messages, setMessages] = useState([])
  const handleSubmit = () => {
    if (keyword.toLocaleLowerCase().startsWith("generate image")) {
      generateImage()
    } else {
      generateText()
    }
  }
  const generateText = () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: keyword,
      createdAt: new Date(),
      user: {
        _id: 2
      }
    }
    const newMsgs = [...messages, message]
    setMessages(newMsgs)
    fetch(COMPLETION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPEN_AI_KEY}`
      },
      body: JSON.stringify({
        "model": COMPLETION_MODEL,
        "prompt": keyword
      })
    }).then((response) => response.json())
    .then((data) => {
      setKeyword("")
      setMessages([...newMsgs, {
        _id: Math.random().toString(36).substring(7),
        text: data.choices[0].text.trim(),
        createdAt: new Date(),
        user: {
          _id: 1
        }
      }])
    })
  }
  const generateImage = () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: keyword,
      createdAt: new Date(),
      user: {
        _id: 2
      }
    }
    const newMsgs = [...messages, message]
    setMessages(newMsgs)
    fetch(GEN_IMAGE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPEN_AI_KEY}`
      },
      body: JSON.stringify({
        "prompt": keyword,
        "model": GEN_IMAGE_MODEL,
        "n": 2,
        "size": "1024x1024"
      })
    }).then((response) => response.json())
    .then((data) => {
      setKeyword("")
      setMessages([{
        _id: Math.random().toString(36).substring(7),
        text: "Image",
        createdAt: new Date(),
        user: {
          _id: 1
        },
        image: data.data[0].url
      }, ...newMsgs])
    })
  }
  const handleChangeKeyword = (value) => {
    setKeyword(value)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center"}}>
        <GiftedChat messages={messages} renderInputToolbar={() => {}} user={{ _id: 1 }} />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ 
          flex: 1, 
          marginLeft: 10,
          justifyContent: "center",
          paddingLeft: 10,
          paddingRight: 10,
          marginBottom: 20, 
          backgroundColor: "white", 
          borderRadius: 10,
          borderColor: "grey", 
          borderWidth: 1, 
          height: 60, 
          marginRight: 10
        }}>
          <TextInput placeholder='Enter your question' value={keyword} onChangeText={handleChangeKeyword}/>
        </View>
        <TouchableOpacity onPress={handleSubmit}>
          <View style={{ backgroundColor: "green", padding: 5, marginRight: 10, marginBottom: 5, }}><Text style={{ color: "white" }}>Send</Text></View>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View> 
    </View>
  );
}
/// 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
