import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import React from "react";
import { Ionicons } from "react-native-vector-icons";
import { colors } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import BackgroundImage from '../../assets/image/resetBackground.jpg'

const sendInstructionsHandle = () => {
  //TODO: handle user verification and send password reset link
};

const ForgetPasswordScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={BackgroundImage} // Specify the path to your background image
      style={styles.backgroundImage}
      resizeMode="cover" // Cover the entire background
      blurRadius={3} // Adjust the blur radius as needed
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.topBarContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle-outline" size={30} color={colors.muted} />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.screenNameText}>Reset Password</Text>
          <Text style={styles.screenNameParagraph}>
            Enter the email associated with your account and we'll send an email
            with instructions to reset the password.
          </Text>
          <View style={styles.formContainer}>
            <CustomInput placeholder={"Enter your Email Address"} />
          </View>
          <CustomButton 
            text={"Send Instructions"}
            onPress={sendInstructionsHandle}
            radius={5}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 19,
  },
  topBarContainer: {
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  screenNameParagraph: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: colors.text,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
});
