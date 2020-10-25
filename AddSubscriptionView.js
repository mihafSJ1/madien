import React from 'react';
import { StyleSheet, Text, View, ScrollView,Dimensions } from 'react-native';
import * as firebase from "firebase";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PaymentFormView from './PaymentFormView';
import { LinearGradient } from "expo-linear-gradient";

/**
 * The class renders a view with PaymentFormView
 */
export default class AddSubscriptionView extends React.Component {
  render() {
    const { amount, reqID,error,onSubmit,submitted} = this.props;
  
    return (
      <View style={styles.container}>
     <LinearGradient
          colors={[
            "rgba(217,174,148,0.36)",
            "rgba(241,220,167,0.43)",
            "#EEF2ED",
          ]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          useAngle
          angle={180}
          style={{
            borderRadius:
              Math.round(
                Dimensions.get("window").width + Dimensions.get("window").height
              ) / 2,
            width: Dimensions.get("window").width * 2.1,
            height: Dimensions.get("window").width * 3.1,
            right: -660,
            top: -630,
            position: "absolute",
          }}
        ></LinearGradient>

        <ScrollView style={styles.background} ref={ref => (this.scrollViewRef = ref)}>
      
          <View style={styles.textWrapper}>
          

            <Text style={[styles.textInputTitle, {fontFamily: "Bahij_TheSansArabic-Light", fontSize:30,marginTop:20,}]}>
          الدفع 
            </Text>
       
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>
          <Text style={{fontFamily: "Bahij_TheSansArabic-Light",  color: "#404040",}}>المبلغ المستحق | </Text> 
            {amount} ريال سعودي
            </Text>
          
          </View>
     
          <View style={styles.cardFormWrapper}>
            <PaymentFormView {...this.props}/>
          </View>
        </ScrollView>
        {/* Scrolls to the payment form */}
        <KeyboardSpacer
          onToggle={() => { setTimeout(() => this.scrollViewRef.scrollToEnd({ animated: true }),0)} }
        />
          
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#F2F4F1",
  },
  background: {
    flex: 1,
    top: 120,
    height: 700,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: "#fff",
  },
  textWrapper: {
    margin: 10,
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center'
  },
  title: {
    fontFamily: "Bahij_TheSansArabic-Bold",
    fontSize:20,
    marginTop: 1,
    marginBottom: 5,
    textAlign: "center",
    color: "#CBCA9E",
    marginRight: 2.5,
  },
  cardFormWrapper: {
    padding: 10,
    margin: 10,
  },
  textInputTitle: {
 
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 20,
    marginTop: 1,
    marginBottom: 5,
    textAlign: "center",
    color: "#404040",
 marginRight: 2.5,
  },
  
});