import React from "react";
import { Formik } from "formik";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import RadioButtonRN from "radio-buttons-react-native";
import { ArabicNumbers } from "react-native-arabic-numbers";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { CheckBox } from "react-native-elements";
import * as yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import CalendarIconComponent from "./CalendarIconComponent";
import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view-fix";
import FirebaseKeys from "./FirebaseKeys";
import BackgroundComponent from "./BackgroundComponent";
// import TopBar from "./TopBar";

if (!firebase.apps.length) {
  firebase.initializeApp(FirebaseKeys.firebaseConfig);
}

//-------------------------------------------- Data
const numericKeyboard = /[^0-9]/;

const data = [
  {
    label: "السداد دفعة واحدة",
  },
  {
    label: "السداد بالتقسيط",
  },
];

const installmentsArray = [
  {
    label: "",
    priceValueArr: "",
    durationValueArr: "",
    installmentsTypeArr: "yearly",
    selected: true,
  },
  {
    label: "",
    priceValueArr: "",
    durationValueArr: "",
    installmentsTypeArr: "monthly",
  },
  {
    label: "",
    priceValueArr: "",
    durationValueArr: "",
    installmentsTypeArr: "weekly",
  },
  {
    label: "",
    priceValueArr: "",
    durationValueArr: "",
    installmentsTypeArr: "daily",
  },
];

const installmentsDropDownArray = [];

var year,
  days,
  week,
  month = 0;

var dateDiffDays,
  dateDiffWeeks,
  dateDiffMonths,
  dateDiffYears = new Date();

var tomorrow,
  today = moment();

var userNameFromDB = "";

export default class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      installmentsState: "",
      priceState: 0,
      durationState: 0,
      submittedDateState: moment().format("YYYY-MM-DD"),
    };
  }

  //-------------------------------------------- Calculations
  repaymentOnce(eDate) {
    var time = new Date(eDate).getTime() - new Date().getTime();
    var totalDays = time / (1000 * 3600 * 24);

    year = Math.floor(totalDays / 365);
    totalDays = totalDays % 365;

    month = Math.floor(totalDays / 30);
    totalDays = totalDays % 30;

    week = Math.floor(totalDays / 7);
    totalDays = totalDays % 7;

    days = Math.floor(totalDays);
  }

  repayementInstallments(price, eDate) {
    const submittedDate = moment();
    const expectedDate = moment(eDate);
    dateDiffDays = expectedDate.diff(submittedDate, "days");
    dateDiffWeeks = expectedDate.diff(submittedDate, "weeks");
    dateDiffMonths = expectedDate.diff(submittedDate, "months");
    dateDiffYears = expectedDate.diff(submittedDate, "years");
    if (dateDiffYears != 0) {
      var yearlyPrice = (price / dateDiffYears).toFixed(2);
      installmentsArray[0].label =
        ArabicNumbers(yearlyPrice) +
        " ريال سعودي لمدة " +
        ArabicNumbers(dateDiffYears) +
        " سنة";
      installmentsArray[0].priceValueArr = yearlyPrice;
      installmentsArray[0].durationValueArr = dateDiffYears;
      installmentsArray[0].installmentsTypeArr = "yearly";
    }

    if (dateDiffMonths != 0) {
      var monthlyPrice = (price / dateDiffMonths).toFixed(2);
      installmentsArray[1].label =
        ArabicNumbers(monthlyPrice) +
        " ريال سعودي لمدة " +
        ArabicNumbers(dateDiffMonths) +
        " شهر";
      installmentsArray[1].priceValueArr = monthlyPrice;
      installmentsArray[1].durationValueArr = dateDiffMonths;
      installmentsArray[1].installmentsTypeArr = "monthly";
    }

    if (dateDiffWeeks != 0) {
      var weeklyPrice = (price / dateDiffWeeks).toFixed(2);
      installmentsArray[2].label =
        ArabicNumbers(weeklyPrice) +
        " ريال سعودي لمدة " +
        ArabicNumbers(dateDiffWeeks) +
        " اسبوع";
      installmentsArray[2].priceValueArr = weeklyPrice;
      installmentsArray[2].durationValueArr = dateDiffWeeks;
      installmentsArray[2].installmentsTypeArr = "weekly";
    }

    if (dateDiffDays != 0) {
      var dailyPrice = (price / dateDiffDays).toFixed(2);
      installmentsArray[3].label =
        ArabicNumbers(dailyPrice) +
        " ريال سعودي لمدة " +
        ArabicNumbers(dateDiffDays) +
        " يوم";
      installmentsArray[3].priceValueArr = dailyPrice;
      installmentsArray[3].durationValueArr = dateDiffDays;
      installmentsArray[3].installmentsTypeArr = "daily";
    }

    for (var i = 0, j = 0; i < installmentsArray.length; i++) {
      if (
        installmentsArray[i].durationValueArr == 0 ||
        installmentsArray[i].durationValueArr == 1
      )
        continue;
      installmentsDropDownArray[j++] = installmentsArray[i];
    }
  }

  //-------------------------------------------- Form Submission
  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
  }

  onSubmitPress(values) {
    const { currentUser } = this.state;

    firebase
      .database()
      .ref("users/" + currentUser.uid)
      .on("value", (snapshot) => {
        userNameFromDB = snapshot.val().fullName;
      });

    const requestID = firebase
      .database()
      .ref("requests/")
      .push(
        {
          price: values.price,
          expectedDate: values.expectedDate,
          submittedDate: this.state.submittedDateState,
          repaymentType: values.repaymentType,
          reason: values.reason,
          userid: currentUser.uid,
          userName: userNameFromDB,
          rqeuestStatus: "Waiting",
          installemntPrice: this.state.priceState,
          installemntDuration: this.state.durationState,
          installmentsType: this.state.installmentsState,
        },
        function (error) {
          if (error) {
            alert(error);
          } else {
            alert("تم إرسال الطلب بنجاح");
          }
        }
      );
  }

  requestSchema = yup.object({
    price: yup
      .number()
      .typeError("المبلغ لا بد أن يكون بأرقام إنجليزية")
      .required("المبلغ مطلوب")
      .integer("المبلغ لا بد أن  يكون عدد صحيح")
      .max(20000, "المبلغ لا بد أن يكون أقل من أو يساوي ٢٠ ألف ريال")
      .min(1, "المبلغ لا بد أن يكون أكبر من أو يساوي ريال"),
    expectedDate: yup
      .date()
      .min(moment(today.add(1, "days")), "التاريخ المتوقع لإكمال السداد مطلوب"),
    // .test(
    //   "enteranceExpectedDate",
    //   "التاريخ المتوقع لإكمال السداد مطلوب",
    //   (val) => {
    //     return props.values.expectedDate == new Date();
    //   }
    // ), //need to cj
    reason: yup.string().min(3, "السبب لا بد أن  يكون ٣ أحرف فأكثر"),
    //trim spaces
  });

  //-------------------------------------------- Rendering react component
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <BackgroundComponent />
        </View>

        <View style={styles.registerBackground}>
          <KeyboardAwareScrollView>
            <Text style={styles.header}>إنشاء طلب </Text>
            <Formik
              validationSchema={this.requestSchema}
              initialValues={{
                user: "",
                usersSelect: false,
                price: "",
                expectedDate: new Date(),
                repaymentType: "",
                reason: "",
                rqeuestStatus: "Waiting",
                submittedDate: new Date(),
              }}
              onSubmit={(values, action) => {
                this.onSubmitPress(values);
              }}
            >
              {(props, setFieldValue) => (
                <View style={styles.requestContainer}>
                  <View style={styles.checkboxContainer}>
                    <Text style={styles.checkboxLabel}>التدين من شخص محدد</Text>
                    <CheckBox
                      style={styles.checkbox}
                      checkedColor="#CBCA9E"
                      checkedIcon="check-box"
                      iconType="material"
                      uncheckedIcon="check-box-outline-blank"
                      onPress={() =>
                        props.setFieldValue(
                          "usersSelect",
                          !props.values.usersSelect
                        )
                      }
                      checked={props.values.usersSelect}
                    />
                  </View>

                  <Text style={styles.textNote}>
                    ملاحظة : عند اختيار هذا الخيار سيظهر طلبك للشخص المحدد فقط{" "}
                  </Text>

                  {props.values.usersSelect ? (
                    <DropDownPicker
                      style={styles.DropDownPicker}
                      items={[
                        { label: "رهام", value: "رهام", selected: true },
                        { label: "رغد", value: "رغد" },
                      ]}
                      value={props.values.user}
                      containerStyle={{
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 50,
                        borderColor: "#CBCA9E",
                      }}
                      style={{
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 50,
                        borderColor: "#57694C",
                        borderWidth: 1,
                        width: 100,
                      }}
                      arrowColor="#9b9b7a"
                      arrowSize={18}
                      containerStyle={{
                        width: 352,
                        height: 40,
                        marginLeft: 35,
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 60,
                        borderBottomRightRadius: 50,
                        marginBottom: 25,
                      }}
                      itemStyle={{
                        backgroundColor: "#fff",
                        textAlign: "right",
                        flexDirection: "row-reverse",
                        justifyContent: "flex-start",
                        fontFamily: "Bahij_TheSansArabic-Light",

                        // to make the list to the right side
                      }}
                      selectedLabelStyle={{
                        color: "#57694C",
                        fontFamily: "Bahij_TheSansArabic-Light",
                      }}
                      activeLabelStyle={{
                        color: "#57694C",
                      }}
                      labelStyle={{
                        backgroundColor: "#fff",
                        fontSize: 16,
                        textAlign: "right",
                        color: "#000",
                        fontFamily: "Bahij_TheSansArabic-Light",
                      }}
                      style={{
                        flexDirection: "row-reverse",
                        // to support RTL
                      }}
                      onChangeItem={(item) =>
                        props.setFieldValue(users, item.label)
                      }
                    />
                  ) : null}

                  <Text style={styles.textInputTitle}>
                    المبلغ <Text style={styles.textError}> *</Text>
                  </Text>

                  <TextInput
                    style={styles.textInput}
                    // placeholderTextColor="#57694C"
                    placeholder="المبلغ"
                    value={props.values.price}
                    onChangeText={props.handleChange("price")}
                    keyboardType="numeric"
                    onBlur={props.handleBlur("price")}
                  />
                  <Text style={styles.textError}>
                    {props.touched.price && props.errors.price}
                  </Text>
                  <Text style={styles.textInputTitle}>
                    التاريخ المتوقع لإكمال السداد{" "}
                    <Text style={styles.textError}> *</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    // placeholderTextColor="#57694C"
                    placeholder="التاريخ "
                    value={props.values.expectedDate}
                    editable={false}
                    onChangeText={
                      (this.repaymentOnce(props.values.expectedDate),
                      this.repayementInstallments(
                        props.values.price,
                        props.values.expectedDate
                      ))
                    }
                    onBlur={props.handleBlur("expectedDate")}
                  />

                  <DatePicker
                    hideText
                    style={styles.datePicker}
                    date={props.values.expectedDate}
                    mode="date"
                    calendar="arabic"
                    locale={"ar"}
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate={moment(tomorrow).add(1, "days")}
                    confirmBtnText="تم"
                    cancelBtnText="إلغاء"
                    iconComponent={<CalendarIconComponent />}
                    customStyles={{
                      dateIcon: {
                        position: "absolute",
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                      },
                      btnTextCancel: {
                        fontFamily: "Bahij_TheSansArabic-Light",
                        color: "#404040",
                        fontSize: 17,
                      },
                      btnTextConfirm: {
                        fontFamily: "Bahij_TheSansArabic-Light",
                        color: "#9B9B7A",
                        fontSize: 17,
                      },
                    }}
                    onDateChange={(date) => {
                      props.setFieldValue("expectedDate", date);
                    }}
                  />
                  <Text style={[styles.textError, { top: -50 }]}>
                    {props.touched.expectedDate && props.errors.expectedDate}
                  </Text>
                  <View style={styles.radio}>
                    <RadioButtonRN
                      initial={1}
                      data={data}
                      box={false}
                      circleSize={10}
                      activeColor={"#CBCA9E"}
                      style={{
                        flexDirection: "row-reverse ",
                        justifyContent: "flex-end",
                        left: 160,
                        marginTop: -15,
                        textAlign: "right",
                      }}
                      boxStyle={{
                        justifyContent: "flex-end",
                        textAlign: "right",
                        flexDirection: "column-reverse ",
                      }}
                      textStyle={{
                        fontSize: 17,
                        textAlign: "right",
                        left: 50,
                        bottom: 20,
                        // marginLeft: 160,
                        fontFamily: "Bahij_TheSansArabic-Light",
                        marginRight: -110,
                        // backgroundColor: "#000",
                      }}
                      selectedBtn={(e) =>
                        props.setFieldValue("repaymentType", e.label)
                      }
                    />
                  </View>
                  {props.values.repaymentType == data[1].label ? (
                    <DropDownPicker
                      style={styles.DropDownPicker}
                      items={installmentsDropDownArray}
                      searchableError={() => (
                        <Text style={[styles.textError, { marginRight: 4 }]}>
                          لظهور الفترات حدد المبلغ و التاريخ المتوقع لإكمال
                          السداد{" "}
                        </Text>
                      )}
                      placeholder="إختر الفترة"
                      placeholderStyle={{ color: "#CBCBCC" }}
                      value={props.values.user}
                      containerStyle={{
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 50,
                        borderColor: "#CBCA9E",
                      }}
                      style={{
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 50,
                        borderColor: "#57694C",
                        borderWidth: 1,
                        width: 100,
                      }}
                      arrowColor="#9b9b7a"
                      arrowSize={18}
                      containerStyle={{
                        width: 352,
                        height: 40,
                        marginLeft: 35,
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50,
                        borderBottomLeftRadius: 60,
                        borderBottomRightRadius: 50,
                        marginBottom: 35,
                      }}
                      itemStyle={{
                        backgroundColor: "#fff",
                        textAlign: "right",
                        flexDirection: "row-reverse",
                        justifyContent: "flex-start",
                        fontFamily: "Bahij_TheSansArabic-Light",
                        // to make the list to the right side
                      }}
                      selectedLabelStyle={{
                        color: "#57694C",
                        fontFamily: "Bahij_TheSansArabic-Light",
                      }}
                      activeLabelStyle={{
                        color: "#57694C",
                      }}
                      labelStyle={{
                        backgroundColor: "#fff",
                        fontSize: 16,
                        textAlign: "right",
                        color: "#000",
                        fontFamily: "Bahij_TheSansArabic-Light",
                      }}
                      style={{
                        flexDirection: "row-reverse",
                        // to support RTL
                      }}
                      onChangeItem={(item) =>
                        this.setState({
                          installmentsState: item.installmentsTypeArr,
                          priceState: item.priceValueArr,
                          durationState: item.durationValueArr,
                        })
                      }
                    />
                  ) : (year == 0 && month == 0 && days == 0 && week == 0) ||
                    (year == -1 && month == -1 && days == -1 && week == -1) ? (
                    <Text style={styles.repaymentTextError}>
                      لظهور المدة حدد التاريخ المتوقع لإكمال السداد{" "}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.textNote,
                        { color: "#9B9B7A", top: -75, right: 10 },
                      ]}
                    >
                      السداد بعد
                      {year != 0 ? (
                        <Text> {ArabicNumbers(year)} سنه </Text>
                      ) : null}
                      {month != 0 ? (
                        <Text> {ArabicNumbers(month)} شهر </Text>
                      ) : null}
                      {week != 0 ? (
                        <Text> {ArabicNumbers(week)} إسبوع </Text>
                      ) : null}
                      {days != 0 ? (
                        <Text> {ArabicNumbers(days)} يوم </Text>
                      ) : null}
                    </Text>
                  )}
                  <Text style={[styles.textInputTitle, { marginTop: -15 }]}>
                    السبب{" "}
                  </Text>
                  <TextInput
                    multiline
                    style={[styles.textInput, { height: 75 }]}
                    placeholder="السبب"
                    onChangeText={props.handleChange("reason")}
                    value={props.values.reason}
                    onBlur={props.handleBlur("reason")}
                  />
                  <Text style={styles.textError}>
                    {props.touched.reason && props.errors.reason}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#D4CEC9" }]}
                      onPress={() => navigation.navigate("Home")}
                    >
                      <Text style={styles.buttonText}> إلغاء </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#CBCA9E" }]}
                      onPress={
                        (() => props.setFieldValue("installmentsType", "ww"),
                        () => props.handleSubmit())
                      }
                    >
                      <Text style={styles.buttonText}> إنشاء طلب </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    textAlign: "right",
    fontFamily: "Bahij_TheSansArabic-Light",
    flex: 1,
    //  overflow:"hidden",
    backgroundColor: "#F2F4F1",
    justifyContent: "center",
    fontSize: 25,
  },
  checkboxLabel: {
    marginTop: 15,
    marginLeft: 190,
    fontSize: 17,
    fontFamily: "Bahij_TheSansArabic-Light",
  },
  checkbox: {
    marginLeft: -20,
  },

  DropDownPicker: {
    marginTop: -10,
    borderRadius: 50,
  },

  background: {
    bottom: 500,
    position: "absolute",
    height: 480,
    // paddingBottom:100,
  },

  header: {
    fontFamily: "Bahij_TheSansArabic-Light",
    color: "#404040",
    fontSize: 30,
    margin: 20,
    top: 0,
    marginBottom: 0,
    textAlign: "center",
    justifyContent: "center",
  },
  registerBackground: {
    marginTop: 70,
    // overflow:'scroll',
    // overflow: "hidden",
    flex: 1,
    height: 700,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: "#fff",
  },
  textInputTitle: {
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 17,
    marginTop: 1,
    marginBottom: 5,
    textAlign: "right",
    color: "#404040",
    marginRight: 35,
  },

  button: {
    alignItems: "center",
    width: 170,
    height: 30,
    marginTop: 50,
    padding: 5,
    borderRadius: 15,
    marginLeft: 10,
    bottom: 30,
    backgroundColor: "#fff",
  },
  buttonText: {
    fontFamily: "Bahij_TheSansArabic-Light",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    fontSize: 30,
  },

  textInput: {
    marginBottom: 13,
    marginLeft: 35,
    alignItems: "center",
    borderColor: "#DBDBDB",
    width: 350,
    backgroundColor: "#fff",
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 5,
    textAlign: "right",
    paddingRight: 10,
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  textNote: {
    color: "#9B9B7A",
    fontSize: 13,
    bottom: 30,
    textAlign: "right",
    marginBottom: -10,
    marginRight: 30,
    fontFamily: "Bahij_TheSansArabic-Bold",
  },
  textError: {
    color: "#A4161A",
    fontSize: 13,
    fontFamily: "Bahij_TheSansArabic-Light",
    textAlign: "right",
    marginRight: 30,
    bottom: 10,
  },
  repaymentTextError: {
    color: "#A4161A",
    fontFamily: "Bahij_TheSansArabic-Light",
    fontSize: 13,
    bottom: 75,
    textAlign: "right",
    marginBottom: -10,
    marginRight: 30,
  },
  radio: {
    marginTop: -35,
  },
  datePicker: {
    bottom: 52,
    left: 56,
    paddingRight: 340,
  },
});
