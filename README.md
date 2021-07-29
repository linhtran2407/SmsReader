# SmsReader

This is a React Native mobile app (available in both Android and iOS) that utilizes below library to read messages from the phone. It can:

- [x] Read new message as soon as when the message comes and return sender, date sent, message body, along with other details
- [x] Read all messages existing in the inbox
- [x] Filter the coming message or all of the exisiting messages based on specific criteria (Currently the filter is based on senders - that is, the app only returns messages from 3 banks in Vietnam)

React Native library used: react-native-android-sms-listener-background (https://www.npmjs.com/package/react-native-android-sms-listener-background)
