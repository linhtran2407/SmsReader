import React, { Component } from 'react'
import type {Node} from 'react'
import SmsListener from 'react-native-android-sms-listener-background'
import SmsAndroid from 'react-native-get-sms-android'
import {
  SafeAreaView,
  Text,
  Alert,
  Button,
  PermissionsAndroid,
} from 'react-native'

const API_READ_SMS = 'https://dev.portal.dichung.vn/api/payment/v1/messages'
const SECRET = 'UWi{HP+O1<2SeK/]$-O?Aq@eC##.w'

async function requestReadSmsPermission() {
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: "Yêu cầu quyền truy cập",
        message: "Cấp quyền đọc tin nhắn cho ứng dụng"
      }
    );
  } catch (error) {
    Alert.alert(error.message || error)
  }
}

class App extends Component {

  pushMessageToServer (messages) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': "application/json",
    }

    const arg = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json",
      },
      body: JSON.stringify({
        messages,
        secret: SECRET,
      })
    }

    console.log(messages)

    return fetch(API_READ_SMS, arg).then((res) => {
      return res.json()
    }).then(({ data, error }) => {
      if (error) {
        return Promise.reject(error)
      }
    })
  }

  sync(done){
    SmsAndroid.list(
      JSON.stringify({
        box: 'inbox',
        maxCount: 100,
      }),
      (error) => {
        console.error(error)
        Alert.alert(error.message || error)
      },
      (count, smsList) => {
        
        const messages = JSON.parse(smsList).map((m) => {
          return {
            originatingAddress: m.address,
            body: m.body,
            timestamp: m.date_sent 
          }
        })

        this.pushMessageToServer(messages)
          .then(done)
          .catch((error) => {
            console.error(error)
            Alert.alert(error.message || error)
          })
      },
    )
  }

  componentDidMount() {
    requestReadSmsPermission()

    SmsListener.addListener(message => {
      this.pushMessageToServer([message])
    })
  }

  render() {
    return  (
      <SafeAreaView>
        <Button
          title="Đồng bộ 100 tin nhắn gần nhất"
          onPress={() => {
            this.sync(() => {
              Alert.alert("Đồng bộ tin nhắn gần nhất thành công")
            })
          }}
        />
      </SafeAreaView>
    )
  }
}

export default App