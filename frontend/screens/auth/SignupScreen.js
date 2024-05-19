import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import header_logo from "../../assets/logo/logo.png";
import background_image from "../../assets/image/signBack.jpg"; // Import your background image

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const signUpHandle = () => {
    // Validation checks
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 6 characters long");
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      email: email,
      password: password,
      name: name,
      userType: "USER",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(network.serverip + "/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.data["email"] === email) {
          navigation.navigate("login");
        }
      })
      .catch((error) => setError(error.message));
  };

  return (
    <InternetConnectionAlert
      onChange={(connectionState) => {
        console.log("Connection State: ", connectionState);
      }}
    >
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground source={background_image} style={styles.backgroundImage}>
          <StatusBar />
          <View style={styles.topBarContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-circle-outline" size={30} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.screenNameText}>Sign up</Text>
              <Text style={styles.screenNameParagraph}>Create your account on AR store</Text>
            </View>
            <View style={styles.formContainer}>
              <CustomAlert message={error} type={"error"} />
              <CustomInput
                value={name}
                setValue={setName}
                placeholder={"Name"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <CustomInput
                value={email}
                setValue={setEmail}
                placeholder={"Email"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <CustomInput
                value={password}
                setValue={setPassword}
                secureTextEntry={true}
                placeholder={"Password"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
              <CustomInput
                value={confirmPassword}
                setValue={setConfirmPassword}
                secureTextEntry={true}
                placeholder={"Confirm Password"}
                placeholderTextColor={colors.muted}
                radius={5}
              />
            </View>
          </ScrollView>
          <View style={styles.bottomContainer}>
            <CustomButton text={"Sign up"} onPress={signUpHandle} />
            <View style={styles.signupContainer}>
              <Text>Already have an account?</Text>
              <Text onPress={() => navigation.navigate("login")} style={styles.signupText}>
                Login
              </Text>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </InternetConnectionAlert>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    padding:15,
  },
  topBarContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
  },
  scrollView: {
    flexGrow: 1,
  },
  welcomeContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  screenNameText: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 5,
  },
  screenNameParagraph: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20, // Adjusted for better spacing
  },
  forgetText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.muted,
    marginTop: 15,
  },
  bottomContainer: {
    alignItems: "center",
    marginTop: 15,
    paddingBottom:20,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  signupText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
});
