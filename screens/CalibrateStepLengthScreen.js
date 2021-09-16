import React, { useState, useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { DeviceMotion, Magnetometer } from "expo-sensors";
import round from "../components/round";
import rotationMatrix from "../components/rotationMatrix";
import detect from "../components/detect";
import movingAverageFilter from "../components/movingAverageFilter";
import { set } from "react-native-reanimated";

export default function CalibrateStepLengthScreen({ navigation }) {
  const SAMPLE_DETECT = 50;
  const K = 10;
  const G = 9.80665;
  const [sample, setSample] = useState(-1);
  const [step, setStep] = useState(0);
  const [distance, setDistance] = useState(0);

  const [inputText1, setInputText1] = useState(0);
  const [inputText2, setInputText2] = useState(0);

  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [rotation, setRotation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const [subscriptionDeviceMotion, setSubscriptionDeviceMotion] =
    useState(null);

  const [zAH, setZAH] = useState([]);
  const [yaw, setYaw] = useState([]);

  const _subscribe = () => {
    setSubscriptionDeviceMotion(
      DeviceMotion.addListener((result) => {
        setAcceleration(result.acceleration);
        setRotation(result.rotation);
      })
    );
    DeviceMotion.setUpdateInterval(20);
  };

  const _unsubscribe = () => {
    subscriptionDeviceMotion && subscriptionDeviceMotion.remove();
    setSubscriptionDeviceMotion(null);
  };

  useEffect(() => {
    setSample((prevSample) => prevSample + 1);
    setYaw((prevYaw) => [...prevYaw, rotation.alpha]);
    const a_rotate = [x_A, y_A, z_A];
    const result1 = rotationMatrix(a_rotate, rotation.beta, rotation.gamma);
    setZAH((prevZAH) => [...prevZAH, result1["_data"][2]]);

    if (zAH.length % SAMPLE_DETECT == 2 * K) {
      const filteredZAH = movingAverageFilter(
        zAH.slice(zAH.length - (SAMPLE_DETECT + 2 * K), zAH.length),
        5
      );
      const yawData = yaw.slice(
        yaw.length - (SAMPLE_DETECT + 2 * K),
        yaw.length
      );
      const stepTemp = detect(filteredZAH, K, yawData, 1);
      setStep((prevStep) => prevStep + stepTemp.length);
      for (let i = 0; i < stepTemp.length; i++) {
        setDistance((prevDistance) => prevDistance + stepTemp[i].sl);
      }
    }
  }, [acceleration]);

  const resetData = () => {
    _unsubscribe();
    setSample(-1);
    setAcceleration({ x: 0, y: 0, z: 0 });
    setRotation({ alpha: 0, beta: 0, gamma: 0 });
    setZAH([]);
    setYaw([]);
    setStep(0);
    setDistance(0);
    setInputText1(0);
    setInputText2(0);
  };

  const updateText1 = (text) => {
    _unsubscribe();
    setInputText1(+text);
  };
  const updateText2 = (text) => {
    _unsubscribe();
    setInputText2(+text);
  };

  const x_A = acceleration.x / G;
  const y_A = acceleration.y / G;
  const z_A = acceleration.z / G;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          For calibration purpose, please hold device in a fixed position, start
          estimate and input the real distance.
        </Text>
        <View style={{ alignItems: "center" }}>
          <TextInput
            style={styles.input}
            placeholder="Enter real distance"
            onChangeText={updateText1}
          />
        </View>
        <Text style={styles.text}>
          If you have used this app before, please input your "k"
        </Text>
        <View style={{ alignItems: "center" }}>
          <TextInput
            style={styles.input}
            placeholder="Enter k (default: 1)"
            onChangeText={updateText2}
          />
        </View>

        <Text style={styles.text}>Sample: {sample} </Text>
        <Text style={styles.text}>Step: {step} </Text>
        <Text style={styles.text}>Estimated Distance: {round(distance)} </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={subscriptionDeviceMotion ? _unsubscribe : _subscribe}
            style={styles.button}
          >
            <Text>{subscriptionDeviceMotion ? "Off" : "On"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={resetData} style={styles.button}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              if (distance != 0 && inputText1 != null && inputText1 != 0) {
                _unsubscribe();
                navigation.navigate("SHSScreen", {
                  k: round(inputText1 / distance),
                });
                setTimeout(
                  () =>
                    alert(
                      `Your k now is set to ${round(inputText1 / distance)}`
                    ),
                  1000
                );
              }
              if (inputText2 != null && inputText2 != 0) {
                _unsubscribe();
                navigation.navigate("SHSScreen", {
                  k: round(inputText2),
                });
                setTimeout(
                  () => alert(`Your k now is set to ${inputText2}`),
                  1000
                );
              }
              if (
                (distance == 0 && inputText1 != null && inputText1 != 0) ||
                (inputText1 == 0 && inputText2 == 0)
              ) {
                _unsubscribe();
                alert(
                  `Invalid Value. Please follow the instructions and try again`
                );
              }
              resetData();
            }}
            style={styles.button}
          >
            <Text>Go to main screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10,
    width: 200,
    alignItems: "center",
  },
});
