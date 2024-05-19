import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
} from "react-native";

import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import header_logo from "../../assets/logo/logo.png";
import background_image from "../../assets/image/background.jpg"; // Import your background image

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Method to store the authUser to async storage
  const _storeData = async (user) => {
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  // Method to validate the user credentials and navigate to Home Screen / Dashboard
  const loginHandle = () => {
    setIsLoading(true);

    // Validation
    if (email === "") {
      setIsLoading(false);
      return setError("Please enter your email");
    }

    if (password === "") {
      setIsLoading(false);
      return setError("Please enter your password");
    }

    if (!email.includes("@")) {
      setIsLoading(false);
      return setError("Email is not valid");
    }

    if (email.length < 6) {
      setIsLoading(false);
      return setError("Email is too short");
    }

    if (password.length < 6) {
      setIsLoading(false);
      return setError("Password must be 6 characters long");
    }

    // API Call
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      redirect: "follow",
    };

    fetch(network.serverip + "/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200 || (result.status === 1 && result.success !== false)) {
          if (result?.data?.userType === "ADMIN") {
            _storeData(result.data);
            setIsLoading(false);
            navigation.replace("dashboard", { authUser: result.data });
          } else {
            _storeData(result.data);
            setIsLoading(false);
            navigation.replace("tab", { user: result.data });
          }
        } else {
          setIsLoading(false);
          setError(result.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  };

  return (
    <InternetConnectionAlert onChange={(connectionState) => {}}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ImageBackground source={background_image} style={styles.backgroundImage}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <ProgressDialog visible={isLoading} label={"Login ..."} />
            <StatusBar />
            <View style={styles.logoContainer}>
              <Image source={header_logo} style={styles.logo} />
              <Text style={styles.welcomeText}>AR store</Text>
              <Text style={styles.welcomeParagraph}>Be more precise</Text>
            </View>
            <View style={styles.formContainer}>
              <CustomAlert message={error} type={"error"} />
              <CustomInput
                value={email}
                setValue={setEmail}
                placeholder={"Username"}
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
              <Text
                onPress={() => navigation.navigate("forgetpassword")}
                style={styles.forgetText}
              >
                Forget Password?
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <CustomButton text={"Login"} onPress={loginHandle} />
              <View style={styles.signupContainer}>
                <Text>Don't have an account?</Text>
                <Text onPress={() => navigation.navigate("signup")} style={styles.signupText}>
                  Signup
                </Text>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </InternetConnectionAlert>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 15,
    marginTop: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeParagraph: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  forgetText: {
    fontSize: 14,
    color: "#BB4D22",
    fontWeight: "500",
    marginTop: 15,
    alignSelf: "center",
  },
  bottomContainer: {
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  signupText: {
    marginLeft: 5,
    color: "#BB4D22",
    fontSize: 16,
    fontWeight: "600",
  },
});
