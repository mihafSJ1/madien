import { StatusBar } from "expo-status-bar";
import React, { useState }  from "react";
import { ArabicNumbers } from "react-native-arabic-numbers";
import { Button, Overlay } from 'react-native-elements';
import { IconButton } from 'react-native-paper';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,

} from "react-native";



import {Item,Container,Header,Icon,Input} from 'native-base';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import * as firebase from "firebase";
import "@firebase/auth";
import "firebase/database";
import "firebase/firestore";
import FirebaseKeys from './FirebaseKeys';

import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { render } from "react-dom";
const firebaseConfig = {
  apiKey: "AIzaSyALc3LJdCzNeP3fbeV2MvTLYDbH8dP-Q-8",
  authDomain: "madeendb2.firebaseapp.com",
  databaseURL: "https://madeendb2.firebaseio.com",
  projectId: "madeendb2",
  storageBucket: "madeendb2.appspot.com",
  messagingSenderId: "814154412010",
  appId: "1:814154412010:web:435cac99ae40206a1ecc93",
  measurementId: "G-SXS9Z8NESC",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var requestArray = [];
let arrayFiltered2=[];


export default class MyReqWithFilter extends React.Component {
  state = { currentUser: null };
  //const [modalVisible, setModalVisible] = useState(false);
  constructor(props) {
    super(props);
  this.state = {
    RatingCount:0,
    modalVisible: false,
    modalVisible2: false,
    specificStatus:false,
    SpecificStatusText:"",
    Searching:false,
     Found:false,
    CreditorName:"",
    CreditorEmail:"",
    pic:
      "https://firebasestorage.googleapis.com/v0/b/madeendb.appspot.com/o/draft%2FUserImageProfile.png?alt=media&token=8d72df15-548d-4112-819e-801ba9c2fea0",
    profilePic:
      "https://firebasestorage.googleapis.com/v0/b/madeendb.appspot.com/o/draft%2FUserImageProfile.png?alt=media&token=8d72df15-548d-4112-819e-801ba9c2fea0",
      searchTerm: '',

    // arrayFiltered:requestArray,
    noSubsidy: 0,
    noDebts: 0,
    requestsArr:[],
  };
  }


  componentDidMount() {
    requestArray=[]
    
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
    firebase
      .database()
      .ref("requests/")
      .on("value", (snapshot) => {
        snapshot.forEach((child) => {
            requestArray.push({         
              creditor:child.val().creditor,
              expectedDate:child.val().expectedDate,
              installemntDuration: child.val().installemntDuration,
              installemntPrice:child.val().installemntPrice,
               installmentsType:child.val().installmentsType,
               price:child.val().price,
              reason:child.val().reason,
               repaymentType:child.val().repaymentType,
             rqeuestStatus:child.val().rqeuestStatus,
               submittedDate:child.val().submittedDate,
              userName:child.val().userName,
              creditorName:child.val().creditorName,
              userid:child.val().userid,
               key:child.key,
               remAmount: child.val().remAmount });
            

        });
        this.setState({requestsArr: requestArray.reverse()})
      });

    
     
    }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  setModalVisible2(visible) {
    this.setState({ modalVisible2: visible });
  }
  
  setCreditorName(Name) {
    this.setState({ CreditorName: Name });
  }
  setCreditorEmail(Email) {
    this.setState({ CreditorEmail: Email });
  }

  setprofilePic(picNew) {
    this.setState({ profilePic: picNew });
  }

  setSearching(flag) {

    this.setState({ Searching: flag}, function() {
      // do something with new state

      console.log("new code")
      console.log(this.state.Searching)
  });
    console.log("تروحين تغيرين الفلاق سيرتش ولا لا ")
    // this.setState({ Searching: flag });
    console.log("غيرت السيرتش")
    console.log(this.state.Searching)
  }
 
  setFound(flag) {

    this.setState({ Found: flag}, function() {
      // do something with new state

      console.log("new code2")
      console.log(this.state.Found)
  });
    // this.setState({ Found: flag });
  }


  setSpecificStatus(flag) {
    // console.log("تروحين تغيرين الفلاق الحاله ولا لا ")
    // this.setState({ specificStatus: flag});
    this.setState({ specificStatus: flag}, function() {
      // do something with new state

      console.log("new code3")
      console.log(this.state.specificStatus)
  });
  }
 


  setSpecificStatusText(text){
    // this.setState({ SpecificStatusText: text });
    this.setState({ SpecificStatusText: text}, function() {
      // do something with new state

      console.log("new code4")
      console.log(this.state.SpecificStatusText)
  });

  }


  setTimelinePic(picNew) {
    this.setState({ pic: picNew });
  }
  viewProfileFunction(item) {
    firebase.auth();
  

    firebase
      .database()
      .ref("users/" + item.creditor)
      .on("value", (snapshot) => {
        console.log("جوا البيس");
        this.setState({ RatingCount: snapshot.val().RatingCount ,rating: snapshot.val().rating}, () => {
          console.log(this.state.RatingCount +"xxx");
         
               if (this.state.RatingCount!=0){
                console.log(this.state.RatingCount +"xxx");
                this.setState({ ratingValue:
         Math.round(this.state.rating / this.state.RatingCount)})
               }else{
                this.setState({ ratingValue:
                0})
                console.log(this.state.RatingCount +"else");

               }

            
          })
        
        

        this.setprofilePic(snapshot.val().UserImage);
        this.setCreditorName(snapshot.val().fullName);
        this.setCreditorEmail(snapshot.val().email);
        console.log(this.state.profilePic);
      });
    this.setState({
      modalVisible2: true,
      namef: item.userName,
      UserIDImage: item.userid,
    });

    let countSubsidy = 0;
    let countDebts = 0;
    firebase
    .database()
    .ref("requests")
    .on("value", function (snapshot) {
      snapshot.forEach(function (child) {
       if(item.creditor == child.val().creditor){
        if ("قيد التنفيذ" == child.val().rqeuestStatus || "مكتمل" == child.val().rqeuestStatus  ){
          countSubsidy++;
        }
        }else  if(item.creditor == child.val().userid){
          if ("مكتمل" == child.val().rqeuestStatus ){
          countDebts++;
        }
      }
    });
    });
    this.setState({ noDebts: countDebts });
    this.setState({ noSubsidy: countSubsidy });
  }


  viewTimelineImageFunction(item) {
    firebase.auth();

    firebase
      .database()
      .ref("users/" + item.userid)
      .on("value", (snapshot) => {
        this.setTimelinePic(snapshot.val().UserImage);
        //console.log("Areej Test");
        console.log(this.state.setTimelinePic);
      });
  }


  

  openModalWithItem(item) {

    
    this.setState({
      submmitedDate: item.submmitedDate,
      modalVisible: true,
      Name: item.userName,
      Type: item.repaymentType,
      Price: item.price,
      EDate: item.expectedDate,
      Reason: item.reason,
      Duration: item.installemntDuration,
      Tprice: item.installemntPrice,
      iType: item.installmentsType,
      submittedDate:item.submittedDate,
      Rstatus: item.rqeuestStatus,
      CreditorID: item.creditor,
      CreName:item.creditorName,
      CreEmail:item.creditorEmail,
      RemAmount: item.remAmount,
      Rkey: item.key,
     repType:item.repaymentType,
      });
    //  this.openModalWithItem2(item)
  }
 

  openModalWithItem2(item) {
    console.log(item.userid);
    firebase.auth();
    firebase
      .database()
      .ref("users/" + item.userid)
      .on("value", (snapshot) => {
  
        
        // console.log(item.userid);
        //  console.log(snapshot.val().UserImage);

        // this.setName(snapshot.val().fullName),
        // this.setEmail(snapshot.val().email),
      
        
        this.setTimelinePic(snapshot.val().UserImage);
        // emailf=snapshot.val().email;
        // pic=snapshot.val().UserImage;
      });
    console.log(this.state.pic);

    
  }
  EditRequest(k,Rstatus){
    if(Rstatus!= "قيد الإنتظار"){
      Alert.alert(
        "عذرا",
        " لا يمكن تعديل هذا الطلب ",
        [{ text: "موافق", },
       ],
        { cancelable: false }
      );
    }
    else{
    this.setModalVisible(!this.state.modalVisible);
    this.props.navigation.navigate('EditRequest',{
      itemId:k,
      
    });

  }}
  conformRemove(k,Rstatus,props){
    if(Rstatus== "قيد الإنتظار"){
    Alert.alert(
      "تنبيه ",
      "هل تريد حذف الطلب ",
      [{ text: "نعم", onPress: () => this.Remove(k,props) },
      {
        text: 'لا',
        // onPress: () =>  this.setModalVisible(!this.state.modalVisible),
        style: 'cancel'
      },],
      { cancelable: false }
    );
  }
  else{
    Alert.alert(
      "تنبيه ",
      "لايمكنك حذف الطلب ",
      [{ text: "موافق"},
     ],
      { cancelable: false }
    );
  }
}

  Remove(k,props){
    this.setModalVisible(!this.state.modalVisible);
    firebase
    .database()
   .ref('requests/' + k).remove()
  
 
   props.navigate("squares")
  }









  list = (array,text) => {
    
    
    const currentUser = firebase.auth().currentUser.uid;
  
    
console.log(this.state.SpecificStatusText)
console.log(this.state.SpecificStatusText)
console.log(this.state.specificStatus)
console.log(text)
    return array.map((c,index) => {
  
      
      if (c.userid == currentUser) {
        
        
        // console.log(specificStatus);
        console.log(this.state.specificStatus);


        if (true) {
      
          
          return (
    
            <View>
                
           
           
              
           
              <TouchableOpacity
                // margin={10}
                style={styles.card}
                
                onPress={() => {
         
                  
          
                  this.openModalWithItem(c);
               
      
              
                  // this.viewProfileFunction(this.state.UserID);
                }}
              >
                 {/* {console.log("here2")}
                 {console.log(c.userName)} */}
                <View style={styles.leftItems}>
                  <Ionicons
                    name="ios-arrow-back"
                    size={25}
                    color="#9B9B7A"
                    solid
                    style={{ marginTop: 25, marginRight: 15 }}
                  />
                  {/* <Ionicons name="ios-star" size={17} color="#E4E4E4" solid />
                  <Ionicons name="ios-star" size={17} color="#E4E4E4" solid />
                  <Ionicons name="ios-star" size={17} color="#E4E4E4" solid />
                  <Ionicons name="ios-star" size={17} color="#E4E4E4" solid />
                  <Ionicons name="ios-star" size={17} color="#E4E4E4" solid /> */}
                </View>
                {c.rqeuestStatus== "قيد الإنتظار" ? (
                  <View style={styles.waitingRectangleShapeView}> 
                    <Text style={styles.status2}> {c.rqeuestStatus} </Text>
              </View>
):(
                      null
                      
                     )}

{c.rqeuestStatus== "قيد التنفيذ" ? (
                  <View style={styles.ProssessRectangleShapeView}> 
                    <Text style={styles.status2}> {c.rqeuestStatus} </Text>
              </View>
):(
                      null
                      
                     )}


{c.rqeuestStatus== "مكتمل" ? (
                  <View style={styles.CompleteRectangleShapeView}> 
                    <Text style={styles.status2}> {c.rqeuestStatus} </Text>
              </View>
):(
                      null
                      
                     )}

{c.rqeuestStatus== "مرفوض" ? (
                  <View style={styles.RejectRectangleShapeView}> 
                    <Text style={styles.status3}> {c.rqeuestStatus} </Text>
              </View>
):(
                      null
                      
                     )}
                
                    
                {/* {console.log("here3")} */}
                
                <View style={styles.rightItems}>
                  <View style={styles.textContainer}>
                {/* {  this.Creditor(c.creditor)} */}
                    <Text style={styles.textLabel}>
                      الدائن |{" "}
                      <Text
                        style={styles.textData}
                        onPress={() => this.viewProfileFunction(c)}
                      >
                        {" "}
                        
             {c.creditorName == "" ? <Text style={styles.textData}>لايوجد دائن محدد </Text>: (
                     <Text style={styles.textData}> {c.creditorName} </Text>
                        
                        
                      )}


                       
                      </Text>
                    </Text>

                    <Text style={styles.textLabel}>
                      {" "}
                      المبلغ |<Text style={styles.textData}> {c.price} <Text>ريال سعودي </Text></Text>
                    </Text>

                   

                    

                    <Text style={styles.textLabel}>
                      {" "}
                      تاريخ إنشاء الطلب |<Text style={styles.textData}> {c.submittedDate} </Text>
                    </Text>
                  </View>
                  {/* <TouchableOpacity style={styles.imageT} 
           onPress={() => {
            // this.setModalVisible2(!this.state.modalVisible2);
             this.viewProfileFunction(c);
           }}>  */}
                  {/* {console.log(this.state.pic)} */}
                  {/* <Image style={styles.imageT}
            // source={{uri: this.state.pic}}
            source={{uri: this.state.pic}}
          ></Image> */}
                  {/* </TouchableOpacity> */}
                </View>
              </TouchableOpacity>
              {/* {console.log("here4")} */}
       
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
               
                  <TouchableOpacity
               
                 style={styles.Editicon}
                 onPress={() => this.EditRequest(this.state.Rkey,this.state.Rstatus)}>
   
                 {this.state.Rstatus!= "قيد الإنتظار" ? null:(
                
               
                 <Text style={styles.Editicon1}>
                   <Ionicons name="md-create" size={30} color="#808065" solid />
                 </Text>)}
               </TouchableOpacity>
               
                    <TouchableOpacity style={styles.Editicon3}
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                    >
                {this.state.Rstatus== "قيد الإنتظار" ? (
                  
                  <AntDesign 
                  style={styles.waitclose}
                  name="close"
                  size={24}
                  color="#746356"
                />
             ):(
                   
                 <AntDesign style={styles.close}  name="close" size={24}
                           color="#746356"
                               />    )}

                    </TouchableOpacity>
                    
                    {this.state.Rstatus== "قيد التنفيذ" ? (
                  <View style={styles.ProRectangleShapeView}> 
                    <Text style={styles.statusInside2}> {this.state.Rstatus} </Text>
              </View>
):(
                      null
                      
                     )}

{this.state.Rstatus== "قيد الإنتظار" ? (
                  <View style={styles.WRectangleShapeView}> 
                    <Text style={styles.statusInside2}> {this.state.Rstatus} </Text>
              </View>
):(
                      null
                      
                     )}


{this.state.Rstatus== "مكتمل" ? (
                  <View style={styles.CRectangleShapeView}> 
                    <Text style={styles.statusInside}> {this.state.Rstatus} </Text>
              </View>
):(
                      null
                      
                     )}

{this.state.Rstatus== "مرفوض" ? (
                  <View style={styles.RRectangleShapeView}> 
                    <Text style={styles.statusInsideReject}> {this.state.Rstatus} </Text>
              </View>
):(
                      null
                      
                     )}


                     {/* header */}
{this.state.Rstatus== "قيد الإنتظار" ? (
           <Text style={styles.waitheader}>تفاصيل الطلب </Text>    
):(
  <Text style={styles.header}>تفاصيل الطلب </Text>
                      
                     )}







         
                    {/* <Text style={styles.textInputTitle}>
                      {" "}
                      حالة الطلب |{" "}
                      <Text style={styles.textData}> {this.state.Rstatus} </Text>
                    </Text> */}
                  {/* {  this.Creditor(c.creditor)} */}

                  {this.state.Rstatus== "قيد الإنتظار" ? (
                    <View style={styles.waitContent}>  

                    <Text style={styles.textInputTitle}>
                      {" "}
                     الدائن |{" "}
                     {this.state.CreName == "" ? <Text style={styles.textData}> لايوجد دائن محدد </Text>: (
                     <Text style={styles.textData}> {this.state.CreName} </Text>
                        
                        
                      )}
                     
                    </Text>

                    {/* <Text style={styles.textInputTitle}>
                      {" "}
                  تاريخ الطلب |{" "}
                      <Text style={styles.textData}>
                        {" "}
                        {this.state.submmitedDate}{" "}
                      </Text>{" "}
                    </Text> */}
                    <Text style={styles.textInputTitle}>
                      نوع التسديد |{" "}
                      <Text style={styles.textData}> {this.state.Type} </Text>
                    </Text>
                    <Text style={styles.textInputTitle}>
                      {" "}
                      المبلغ|
                      <Text style={styles.textData}>
                        {" "}
                        {this.state.Price}{" "}
                        <Text>ريال سعودي </Text>
                      </Text>{" "}
                    
                    </Text>

                    <Text style={styles.textInputTitle}>
                      {" "}
                      التاريخ المتوقع لإكمال التسديد|{" "}
                      <Text style={styles.textData}>
                        {" "}
                        {this.state.EDate}{" "}
                      </Text>{" "}
                    </Text>
                    <Text style={styles.textInputTitle}>
                      {" "}
                      {this.state.Reason == "" ? <Text> السبب |</Text>: <Text> السبب |</Text>}
                      {this.state.Reason == "" ? <Text style={styles.textData}> لايوجد سبب </Text>: (
                        <Text style={styles.textData}>
                          {" "}
                          {this.state.Reason}{" "}
                        </Text>
                        
                        
                      )}
                    </Text>


                    <Text style={styles.textInputTitle}>

                       {this.state.Duration == "" ? null : <Text> فترة التقسيط |</Text>}
                       {this.state.Duration == "" ? null : (
                    <Text style={styles.textData}> {this.state.Duration} </Text>
                       )}
                      </Text><Text style={styles.textInputTitle}>{" "}
                      {this.state.iType == "" ? null : <Text> طريقة التقسيط |</Text>}
                       {this.state.iType == "" ? null : (
                      <Text style={styles.textData}> {this.state.iType} </Text>
                       )}
                      </Text>
                        <Text style={styles.textInputTitle}>
                        {" "}
                       {this.state.Tprice == "" ? null : <Text> مبلغ التقسيط |</Text>}
                        {this.state.Tprice == "" ? null : (
                       <Text style={styles.textData}> {this.state.Tprice} </Text>
                        )}
                        </Text>


                        </View>
                      //  /end content wait  
):(
  <View style={styles.Content}>  

  <Text style={styles.textInputTitle}>
    {" "}
   الدائن |{" "}



   {this.state.CreName == "" ? <Text style={styles.textData}> لايوجد دائن محدد </Text>: (
                     <Text style={styles.textData}> {this.state.CreName} </Text>
                        
                        
                      )}
  </Text>


  <Text style={styles.textInputTitle}>
    نوع التسديد |{" "}
    <Text style={styles.textData}> {this.state.Type} </Text>
  </Text>
  <Text style={styles.textInputTitle}>
    {" "}
    المبلغ|
    <Text style={styles.textData}>
      {" "}
      {this.state.Price}{" "}
      <Text>ريال سعودي </Text>
    </Text>{" "}
  
  </Text>

  <Text style={styles.textInputTitle}>
    {" "}
    التاريخ المتوقع لإكمال التسديد|{" "}
    <Text style={styles.textData}>
      {" "}
      {this.state.EDate}{" "}
    </Text>{" "}
  </Text>
  {/* <Text style={styles.textInputTitle}>
    {" "}
    {this.state.Reason == "" ? null : <Text> السبب |</Text>}
    {this.state.Reason == "" ? null : (
      <Text style={styles.textData}>
        {" "}
        {this.state.Reason}{" "}
      </Text>
      
      
    )}
  </Text>
  // */}
  <Text style={styles.textInputTitle}>
                    
                      <Text> السبب |</Text>
                      {this.state.Reason == "" ? (
                        <Text style={styles.textData}>
                        
                        لا يوجد سبب
                       
                      </Text>
                      ) : (
                        <Text style={styles.textData}>
                        
                          {this.state.Reason}
                        </Text>
                        
                      )}
                    </Text>



  <Text style={styles.textInputTitle}>

     {this.state.Duration == "" ? null : <Text> فترة التقسيط |</Text>}
     {this.state.Duration == "" ? null : (
  <Text style={styles.textData}> {this.state.Duration} </Text>
     )}
    </Text><Text style={styles.textInputTitle}>{" "}
    {this.state.iType == "" ? null : <Text> طريقة التقسيط |</Text>}
     {this.state.iType == "" ? null : (
    <Text style={styles.textData}> {this.state.iType} </Text>
     )}
    </Text>
      <Text style={styles.textInputTitle}>
      {" "}
     {this.state.Tprice == "" ? null : <Text> مبلغ التقسيط |</Text>}
      {this.state.Tprice == "" ? null : (
     <Text style={styles.textData}> {this.state.Tprice} </Text>
      )}
      </Text>

      {this.state.Rstatus == "قيد التنفيذ" && this.state.repType == "السداد بالتقسيط" ? (
                      <Text style={styles.textInputTitle}>
                      {" "}
                      المتبقي من الدين|
                      <Text style={styles.textData}>
                        {" "}

                        {this.state.RemAmount}{" "}
                        <Text>ريال سعودي </Text>
                      </Text>{" "}
                    {console.log("دخلت ولا لا ")}
                    </Text>
                  
                    
                    ) : null }


      </View>
      // end content 
                      
                     )}





               

                    <View style={styles.buttonContainer}>
                    
                    {/* {c.rqeuestStatus == "قيد الإنتظار" ? <Text> </Text> : <Text style={styles.textData}> {c.rqeuestStatus} </Text>} */}
                    
{/* {if(c.rqeuestStatus == "قيد الإنتظار"){} } */}
{this.state.Rstatus== "قيد الإنتظار" ? (
                         <Text style={styles.textWait}> انتظر حتى يتم الرد على طلبك </Text>
                        
):(
                      // <TouchableOpacity
                      //   style={[styles.button, { backgroundColor: "#D4CEC9" }]}
                      // >
                      //   <Text style={styles.buttonText}> رفض </Text>
                      // </TouchableOpacity>
                      null
                      
                     )}
                    
                {this.state.Rstatus== "قيد الإنتظار" ? (    
                    <TouchableOpacity
                         style={[styles.dbutton, { backgroundColor: "#BE4F4F" }]}
                         onPress={() => this.conformRemove(this.state.Rkey,this.state.Rstatus,this.props.navigation)}><Text style={styles.buttonTextDelete}> حذف </Text>
                         </TouchableOpacity>):(null)}


{this.state.Rstatus== "قيد التنفيذ" ? ( 
<TouchableOpacity
onPress = {()=>  { this.props.navigation.navigate("PayAsDebtor",{amount:this.state.RemAmount, reqID: this.state.Rkey,type:this.state.Type}),this.setModalVisible(!this.state.modalVisible)}}
    style={[styles.Paybutton, { backgroundColor: "#66795A" }]}
  >
    <Text style={styles.PaybuttonText}> دفع </Text>
  </TouchableOpacity>
  ):(null
  
 )}

{this.state.Rstatus== "مكتمل" ? ( 
                       <Text style={styles.textComplete}> "تم تسديد جميع المستحقات" </Text>
  
 ): null }
 
 {this.state.Rstatus== "مرفوض" ? ( 
                       <Text style={styles.textReject}> نعتذر، تم رفض طلبك </Text>
  
 ): null }

{this.state.Rstatus== "قيد التنفيذ" ? ( 
  <IconButton
                     style={styles.chatIconProcess}
                      icon='message-plus'
                      size={38}
                      color='#986979'
                      //,{secondID:this.state.creditor}
     
                      onPress={() => {this.props.navigation.navigate('addRoom',{secondID:this.state.CreditorID , reqIDforChat:this.state.Rkey, secondName: this.state.CreName,   firstName:this.state.Name    }),this.setModalVisible(!this.state.modalVisible)}}
                    />
  ):(null
  
 )}

{this.state.Rstatus== "مرفوض" ? ( 
  <IconButton
                     style={styles.chatIconReject}
                      icon='message-plus'
                      size={38}
                      color='#986979'
                      //,{secondID:this.state.creditor}
                    
                      onPress={() => {this.props.navigation.navigate('addRoom',{secondID:this.state.CreditorID , reqIDforChat:this.state.Rkey, secondName: this.state.CreName, firstName:this.state.Name }),this.setModalVisible(!this.state.modalVisible)}}
                    />  
 ): null }
{this.state.Rstatus== "مكتمل" ? ( 
  <IconButton
                     style={styles.chatIconComplete}
                      icon='message-plus'
                      size={38}
                      color='#986979'
                      //,{secondID:this.state.creditor}
                    
                      onPress={() => {this.props.navigation.navigate('addRoom',{secondID:this.state.CreditorID , reqIDforChat:this.state.Rkey, secondName: this.state.CreName, firstName:this.state.Name }),this.setModalVisible(!this.state.modalVisible)}}
                    />  
 ): null }
   
      {/* {this.state.CreName == "" ? (null): (
                     <IconButton
                     style={styles.chatIcon2}
                      icon='message-plus'
                      size={38}
                      color='#986979'
                      //,{secondID:this.state.creditor}
                    
                      onPress={() => {this.props.navigation.navigate('addRoom',{secondID:this.state.CreditorID , reqIDforChat:this.state.Rkey}),this.setModalVisible(!this.state.modalVisible)}}
                    />
                        
                        
                      )} */}


                    </View>
                  </View>
                </View>
              </Modal>
        

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible2}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisible2(!this.state.modalVisible2);
                      }}
                    >
                      <AntDesign
                        style={styles.closeProfile}
                        name="close"
                        size={24}
                        color="#746356"
                      />
            
                      
                    </TouchableOpacity>
                    {this.state.CreditorName!=""? ( 
                      <Image
                      style={styles.UserImage}
                      source={{ uri: this.state.profilePic }}
                    />
      
 ): null }
                    
                    {this.state.CreditorName!=""? ( 
                                         <Text style={styles.UserName}>{this.state.CreditorName}</Text>

      
 ): null }
          {this.state.CreditorName!=""? ( 
     <Text style={styles.Email}>{this.state.CreditorEmail}</Text>
     

 ): null }
    
                        {  this.state.ratingValue == 0 ?
              <Text style={styles.RateStarts}>
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                </Text>
             
                : null}
                { this.state.ratingValue == 1 ?
                <Text style={styles.RateStarts}>
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                </Text>
                : null}
                { this.state.ratingValue== 2?
                <Text style={styles.RateStarts}>
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                </Text>
                : null}
                {this.state.ratingValue== 3 ?
                <Text style={styles.RateStarts}>
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                </Text>
                : null}
                 { this.state.ratingValue == 4 ?
                <Text style={styles.RateStarts}>
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#E4E4E4" solid />
                </Text>
             
                : null}
                { this.state.ratingValue== 5?
                <Text style={styles.RateStarts}>
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
                <Ionicons name="ios-star" size={33} color="#FFCB69" solid />
  
                </Text>:null}
                <Text style={styles.RatingNumber}> عدد المقيّمين | { ArabicNumbers(this.state.RatingCount)}</Text>
                
                    {this.state.CreditorName!=""? ( 
                          <Text style={styles.subsidy}> عدد التسليف </Text>

      ): null }
                    {this.state.CreditorName!=""? ( 
                          <Text style={styles.debts}> عدد الاستلاف </Text>

      ): null }
                    {this.state.CreditorName!=""? ( 
        <View style={styles.PinkRectangleShapeView}>
        <Text style={[styles.buttonText,{fontSize:40,color:"#fff"}]}>{ArabicNumbers(this.state.noSubsidy)}</Text>
      </View>

      ): null }
                  
                    {this.state.CreditorName!=""? ( 
        <View style={styles.YellowRectangleShapeView}>
        <Text style={[styles.buttonText,{fontSize:40,color:"#fff"}]}>{ArabicNumbers(this.state.noDebts)}</Text>
      </View>
      ): null }
                  
                    {this.state.CreditorName!=""? ( 
       <View style={styles.buttonContainer}>
       <TouchableOpacity
         style={[styles.button, { backgroundColor: "#fff" }]}
       ></TouchableOpacity>
       <TouchableOpacity
         style={[styles.button, { backgroundColor: "#fff" }]}
       ></TouchableOpacity>
     </View>
      ): <Text style={styles.noUser}>لا يوجد دائن محدد</Text> }
   
             

                   
                  </View>
                </View>
              </Modal>
            </View>
          );
        }
      
      }
    });
  };


//To search a specific status 
searchStatus = (textTosearch)  =>{
   arrayFiltered2=[];
  firebase.auth();
  console.log("////////////////////////////////");
  this.setSpecificStatusText(textTosearch);
  console.log(this.state.SpecificStatusText);
  console.log("////////////////////////////////");
  if(textTosearch==""){
    this.setSearching(false);
    return;
  }

  if(textTosearch!=""){
    this.setSearching(true);
 
  }

  if(textTosearch=="قيد الانتظار"){
    textTosearch="قيد الإنتظار";
}

   var check=false;
  for(var i =0 ,j = 0;i<this.state.requestsArr.length;i++){
    console.log(textTosearch)
    if(textTosearch!=""){
    if(textTosearch.trim()==this.state.requestsArr[i].rqeuestStatus.trim()){
     check=true;
      this.setFound(true);
      // this.setSearching(true);
      this.setSpecificStatus(true);
      this.setSpecificStatusText(textTosearch);
      // specificStatus="true";
      console.log("طباعه الحاله ");
      console.log(this.state.specificStatus);
      // console.log(specificStatus);
      // this.setSpecificStatusText(textTosearch);
      console.log(this.state.SpecificStatusText);
    // alert(requestArray[i].creditorName)
    arrayFiltered2[j++]=this.state.requestsArr[i]
    console.log(" دخلت الاف  ")

    // this.setState({
    //   specificStatus: true,
    //   SpecificStatusText:textTosearch ,
     
    // });
    
    }
    }
    }

  console.log(" دخلت السيرتش ")
 
console.log(arrayFiltered2)
console.log(" اخر السيرتش ")
console.log(check)

  }


  
  render() {

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
 {this.state.modalVisible || this.state.modalVisible2?
        <View style=  {styles.shadow}>

        </View>
        : null}

        {/* -------------------------------------- CARD 1*/}

       {/* SEARCH */}
                 <View style={styles.searchb} >

        <Icon name="" />
       <SearchInput 
       style={styles.searchInput}
       onChangeText={ (text) => { this.searchStatus(text) }
     
      } 
      
       placeholder="ابحث عن حالة محدده"/>

   
   
  
<View style={styles.twoButton}>
    
        <Text style={styles.buttonTextNav2}   onPress={() => this.props.navigation.navigate("myReqWithFilter")}> مدين </Text>
        <View style={styles.WhiteRectangleShapeView}> 
              </View>
     



           
              <View style={styles.Green2RectangleShapeView}> 
              </View>
              

              <Text style={styles.buttonTextNav}
          onPress={() => this.props.navigation.navigate("ReqAsCreditorWithFilter")}
              > دائن </Text>
            
        <View style={styles.GreenRectangleShapeView}>
                
              </View>
              </View>
          


              <View style={styles.ViewList}>

                {/* اذا هو ما بحث الديفولت فولس وبطلع طبيعي  */}
{/* 
                {this.state.Found?(console.log(arrayFiltered2)&&console.log("5555555555555")&&
                 <ScrollView>{this.list(arrayFiltered2,null)}</ScrollView>
                  ):null} */}

                  
            {/* {this.state.Searching ? (null):<ScrollView>{this.list(requestArray,null)}</ScrollView> } */}

                
            



{this.state.Searching && this.state.Found?(



<ScrollView>{this.list(arrayFiltered2,this.state.SpecificStatusText)}</ScrollView>
):this.state.Searching && !this.state.Found?(


null): <ScrollView>{this.list(this.state.requestsArr,null)}</ScrollView>}



{/* this.setSpecificStatus(true)&&  */}




        



                {/* {this.searchStatus("مكتمل")} */}
              {/* {this.listToSearch()}  */}
        {/* <ScrollView>{this.list()}</ScrollView> */}
        </View>
        {/*View request */}
      </View>
      </View>

    );
  }
}






////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8F4",
    top: 120,

  },
  container2: {
    marginTop: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  ViewList:{
marginBottom:220,
// backgroundColor:'blue',
top:-25,
  },
  card: {
      top:1,
    backgroundColor: "#fff",
    marginBottom: 10,
    width: 400,
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    flexDirection: "row",
    // justifyContent: "flex-end",
  },
  rightItems: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    width: "100%",
    left: -120,
  },

  leftItems: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // backgroundColor: "#000",
    left: 10,
    top: 20,
    // width: "100%",
    
  },
 
  chatIconProcess:{
    bottom:-10,
    left:-160,
   // backgroundColor:'#FFEEC4',
   shadowColor: "#717172",
   shadowOpacity: 0.15,
   shadowOffset: {
     width: 0,
     height: 0,
   }
  },
  chatIconReject:{
    bottom:-48,
    left:-145,
    shadowColor: "#717172",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 0,
    }
   // backgroundColor:'#FFEEC4',
  },


  chatIconComplete:{
    bottom:-55,
    left:-270,
   // backgroundColor:'#FFEEC4',
   shadowColor: "#717172",
   shadowOpacity: 0.15,
   shadowOffset: {
     width: 0,
     height: 0,
   }
  },


  textContainer: {
    marginRight: 10,
  },

  textLabel: {
    color: "#404040",
    fontFamily: "Bahij_TheSansArabic-Light",
    textAlign: "right",
    fontSize: 16,
   
  },

  textData: {
    color: "#CBCA9E",
    fontFamily: "Bahij_TheSansArabic-Bold",
  },
  textComplete: {
    color: "#A8CB9E",
    fontFamily: "Bahij_TheSansArabic-Bold",
    fontSize:20,
    alignItems: "center",
    left:40,
    top:50,
    shadowColor: "#FFCB69",
    shadowOpacity: 0.41,
    shadowOffset: {
      width: 0,
      height: 0,
    }
  },
  

  textReject: {
    color: "#BE6A6C",
    fontFamily: "Bahij_TheSansArabic-Bold",
    fontSize:20,
    alignItems: "center",
    left:87,
    top:47,
    shadowColor: "#FFCB69",
    shadowOpacity: 0.41,
    shadowOffset: {
      width: 0,
      height: 0,
    }
  },


  textWait: {
    color: "#D3CDC8",
    fontFamily: "Bahij_TheSansArabic-Bold",
    fontSize:20,
    top:-20,
    alignItems: "center",
    left:35,
    shadowColor: "#FFCB69",
    shadowOpacity: 0.41,
    shadowOffset: {
      width: 0,
      height: 0,
    }
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width:650,
    right:120,
  },
  modalView: {
    position: "absolute",
    bottom: 0,
    width:425,
    borderTopRightRadius: 70,
    borderTopLeftRadius: 70,
    height: 600,
    // margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 100,
  },

  modalText: {
    marginBottom: 15,
    // textAlign: "center"
  },
 
  buttonText: {
    fontFamily: "Bahij_TheSansArabic-Light",
    textAlign: "center",
    fontSize: 50,
    color:'#fff',
    fontWeight:"bold",
  },
  PaybuttonText: {
    fontFamily: "Bahij_TheSansArabic-Light",
    textAlign: "center",
    fontSize: 50,
    color:'#fff',
    fontWeight:"bold",
    
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginLeft: 25,
    fontSize: 10,
  },
  header: {
    fontFamily: "Bahij_TheSansArabic-Light",
    color: "#404040",
    fontSize: 30,
    // margin: 20,
    top: -50,

    textAlign: "center",
    justifyContent: "center",
    marginBottom: 30,
    width:170,
    left:90,
    
  },


  Content:{
  // backgroundColor:'red',
},

waitContent:{
  top:-45,
  // backgroundColor:'pink',
},




  waitheader:{
    fontFamily: "Bahij_TheSansArabic-Light",
    color: "#404040",
    fontSize: 30,
    // margin: 20,
    top: -80,

    textAlign: "center",
    justifyContent: "center",
    marginBottom: 30,
    width:170,
    left:90,
    // backgroundColor:'red',
  },





  textInputTitle: {
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    color: "#57694C",
    textAlign: "right",

    // marginRight: 1,
  },
  close: {
    marginLeft: 20,
    top:20,
    zIndex:13,
    width:40,
  },

  closeProfile: {
    marginLeft: 10,
    top:-4,
    zIndex:13,
    width:40,
  },

  waitclose: {
    marginLeft: 10,
    top:-1,
  // backgroundColor:'black',
    width:20,
  },


  Editicon3:{
    top:-40,
    width:30,
    // backgroundColor:'pink',
  },

  // style for view profile

  imageT: {
    width: 60,
    height: 60,
    resizeMode: "stretch",

    zIndex: 2,
    borderWidth: 10,
    borderColor: "red",
  },

 
  UserName: {
    fontFamily: "Bahij_TheSansArabic-Bold",
    fontSize: 28,
    margin: 20,
    marginBottom: 40,
    bottom: -5,
    right: -1,
    textAlign: "center",
    justifyContent: "center",
    color: "#746356",
  },
  noUser: {
    fontFamily: "Bahij_TheSansArabic-Bold",
    fontSize: 28,
    margin: 20,
    marginBottom: 40,
    bottom: -125,
    right: -1,
    textAlign: "center",
    justifyContent: "center",
    color: "#746356",
  },
  
  PinkRectangleShapeView: {
    width: 120,
    height: 70,
    marginTop: 0,
    padding: 5,
    borderRadius: 15,
    marginLeft: 33,
    marginBottom: 0,
    left: 165,
    top: -35,
    backgroundColor: "#D9AE94",
    borderColor: "#D3CECA",
    borderWidth: 2,
  },
  YellowRectangleShapeView: {
    alignItems: "center",
    width: 120,
    height: 70,
    marginTop: 0,
    padding: 5,
    borderRadius: 15,
    marginLeft: 33,
    marginBottom: 0,
    right: -5,
    top: -105,
    backgroundColor: "#F1DCA7",
    borderColor: "#D3CECA",
    borderWidth: 2,
  },

  debts: {
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 18,
    textAlign: "left",
    color: "#404040",
    top: -40,
    left: 50,
    zIndex: 2,
  },
  subsidy: {
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 18,
    textAlign: "right",
    color: "#404040",
    top: -12,
    right: 48,
  },
  RateStarts: {
    left: 108,
    bottom: 70,
  },

  GreenRectangleShapeView: {
    alignItems: "center",
    width: 360,
    height: 40,
    marginTop: 0,
    padding: 5,
    borderRadius: 15,
    marginLeft: 0,
    marginBottom: 0,
    right: 0,
    top: -130,
    backgroundColor: "#EAF4E1",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    marginBottom:-122,
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    
  },

  WhiteRectangleShapeView: {
    alignItems: "center",
    width: 192,
    height: 34,
    marginTop: 0,
    padding: 5,
    borderRadius: 13,
    marginLeft: 0,
    marginBottom: 0,
    right: 0,
    left:164,
    top: -32,
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    zIndex:4,
    
    
  },
  ProssessRectangleShapeView:{
    alignItems: "center",
    width: 88,
    height: 25,
    borderRadius: 15,
    left:10,
    top: 18,
    backgroundColor: "#F1DCA7",
    
   

  },

  waitingRectangleShapeView:{
    alignItems: "center",
    width: 88,
    height: 25,
    borderRadius: 15,
    left:10,
    top: 18,
    backgroundColor: "#D3CDC8",
    
   

  },

  RejectRectangleShapeView:{
    alignItems: "center",
    width: 88,
    height: 25,
    borderRadius: 15,
    left:10,
    top: 18,
    backgroundColor: "#BE6A6C",
    
   

  },

  CompleteRectangleShapeView:{
    alignItems: "center",
    width: 88,
    height: 25,
    borderRadius: 15,
    left:10,
    top: 18,
    backgroundColor: "#A8CB9E",
    
  },
  status3:{
    textAlign: "center",
   
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 15,
    color: "#FFFFFF",
  },
  status2:{
    textAlign: "center",
   
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 15,
    color: "#404040",
  },

  statusInside:{
    textAlign: "right",
   left:160,
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 15,
    color: "#404040",
  },

  statusInside2:{
    textAlign: "right",
   left:150,
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 15,
    color: "#404040",
  },

  statusInsideReject:{
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 15,
    color: "#FFFFFF",
    left:160,
  },

  ProRectangleShapeView:{
    alignItems: "center",
    width: 388.5,
    height: 25,
    
    borderTopEndRadius:15,
    borderTopRightRadius:15,
    borderBottomRightRadius:15,
    
    left:-30,
    top: 45,
    backgroundColor: "#F1DCA7",
  
  },

  WRectangleShapeView:{
    alignItems: "center",
    width: 388.5,
    height: 25,
    
    borderTopEndRadius:15,
    borderTopRightRadius:15,
    borderBottomRightRadius:15,
    
    left:-30,
    top: 15,
    backgroundColor: "#D3CDC8",
  
  },

  RRectangleShapeView:{
    alignItems: "center",
    width: 388.5,
    height: 25,
    
    borderTopEndRadius:15,
    borderTopRightRadius:15,
    borderBottomRightRadius:15,
    
    left:-30,
    top: 45,
    backgroundColor: "#BE6A6C",
  
  },

  CRectangleShapeView:{
    alignItems: "center",
    width: 388.5,
    height: 25,
    
    borderTopEndRadius:15,
    borderTopRightRadius:15,
    borderBottomRightRadius:15,
    
    left:-30,
    top: 45,
    backgroundColor: "#A8CB9E",
  
  },

  test:{
backgroundColor:'red',
  },

  Green2RectangleShapeView: {
    alignItems: "center",
    width: 178,
    height: 27,
    marginTop: 0,
    padding: 5,
    borderRadius: 15,
    marginLeft: 0,
    marginBottom: 0,
    right: 0,
    left:0,
    top: -68,
    backgroundColor: "#EAF4E1",
    borderColor: "#EAF4E1",
    borderWidth: 1,
    zIndex:2,
    
    
  },
  buttonTextNav:{
    textAlign: "center",
    top: -95,
    right: 90,
    left:25,
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 22,
    color: "#404040",
    zIndex:2,
    width:50,
    paddingLeft: 45,
    paddingRight:90,
    // paddingBottom: 2,
    // paddingTop: 0,
    // backgroundColor:'red',
    
  },
  buttonTextNav2:{
    textAlign: "center",
    top: -1,
    left: 180,
    right:100,
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 22,
    color: "#404040",
    zIndex:7,
    paddingLeft: 50,
    paddingRight: 50,
    // paddingBottom: 2,
    // paddingTop: 0,
    // backgroundColor:'pink',
    width:100,
    paddingRight: 90,
    paddingLeft: 60,
    paddingTop:-40,
   
  },
  buttonText: {
    textAlign: "center",
    top: -1,
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 15,
    color: "#404040",
  },
  buttonTextDelete:{
    textAlign: "center",
    top: -1,
    fontFamily: "Bahij_TheSansArabic-Bold",
    fontSize: 15,
    color: "#ffffff",
  },






  PaybuttonText: {
    textAlign: "center",
    fontFamily: "Bahij_TheSansArabic-Bold",
    top: -4,
    bottom: -18,
    textAlign: "center",
    fontSize: 18,
    color:'#fff',
    // fontWeight:"bold",
  },

  UserImage: {
    alignItems: "center",
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    left: 100,
    top: 0,
    zIndex: 2,
    width: 160,
    height: 160,
    resizeMode: "stretch",
    borderRadius: 100,
    borderColor: "#CBCA9E",
    borderWidth: 4,
  },

  

  button: {
    // alignItems: "center",
    // width: 170,
    // height: 30,
    // marginTop: 10,
    // padding: 5,
    // borderRadius: 15,
    // marginLeft: 10,
    // backgroundColor: "#fff",
    // fontSize:10,
    alignItems: "center",
    width: 170,
    height: 30,
    marginTop: 10,
    padding: 5,
    borderRadius: 15,
    marginLeft: 10,
    backgroundColor: "#fff",
    right:30,
  },

  Paybutton:{
    // alignItems: "center",
    // width: 170,
    // height: 30,
    // marginTop: 10,
    // padding: 5,
    // borderRadius: 15,
    // marginLeft: 10,
    // backgroundColor: "#fff",
    // fontSize:10,
    alignItems: "center",
    width: 170,
    height: 35,
    marginTop: 0,
    padding: 5,
    borderRadius: 15,
    marginLeft: 10,
    backgroundColor: "#fff",
    right:-70,
    top:7,
    shadowColor: "#000",
    shadowOpacity: 0.21,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },




  dbutton:{
    alignItems: "center",
    width: 170,
    height: 35,

    padding: 5,
    borderRadius: 15,
    marginLeft: 10,
    backgroundColor: "#fff",
    right:190,
    top:25,
    shadowColor: "#000",
    shadowOpacity: 0.21,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    
  },

  Editicon:{
// backgroundColor:'red',
width:40,
left:300,
top:-10,
  },


  Editicon1: {
    left: 10,
    bottom: 0,
    zIndex: 2,
    width:40,
    // backgroundColor:'black',
    shadowColor: "#000000",
    shadowOpacity: 0.31,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  textContainer: {
    marginRight: 10,
  },
  Email: {
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 20,
    marginBottom: 0,
    margin: 20,
    marginBottom: 40,
    bottom: 40,
    right: -1,
    textAlign: "center",
    justifyContent: "center",
    color: "#746356",
  },
  RatingNumber: {
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 20,
  
     marginTop: -10,
     marginBottom: -17,
    bottom: 60,
    right: -6,
    textAlign: "center",
    justifyContent: "center",
    color: "#746356",
  },



  searchb:{
    top:10,
    bottom:-30,
    flex: 1,
    // backgroundColor: '#fff',
    justifyContent: 'flex-start',
    // backgroundColor:'pink',
    width:390,
   
  
  },


  searchInput:{
  top:20,
    padding: 10,
    borderColor: '#ffffff',
    borderWidth: 1,
    width:390,
    height:40,
    borderRadius:10,
    fontSize:15,
    fontFamily: "Bahij_TheSansArabic-Light",
    left:0,
    textAlign:'right',
    marginBottom:10,
    backgroundColor:'#ffffff',
  
  },

  twoButton:{
top:-85,
left:20,
  },

  searchHeader:{
  
    backgroundColor: 'transparent',
    opacity: 0.6
    
  },
shadow:{
  position:'absolute',
  height:2000,
  width:'100%',
  opacity:0.5,
  padding:100,
  backgroundColor:"gray",
  zIndex:120,

}

  //end
});