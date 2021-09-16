import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DeviceMotion } from "expo-sensors";
import round from "../components/round";
import { atan2, pi } from "mathjs";
import rotationMatrix from "../components/rotationMatrix";

export default function DeviceMotionScreen({ navigation }) {
  const G = 9.80665;
  const [sample, setSample] = useState(-1);

  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [accelerationIncludingGravity, setAccelerationIncludingGravity] =
    useState({
      x: 0,
      y: 0,
      z: 0,
    });

  const [rotation, setRotation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  // const [rotationRate, setRotationRate] = useState({
  //   alpha: 0,
  //   beta: 0,
  //   gamma: 0,
  // });

  const [subscriptionDeviceMotion, setSubscriptionDeviceMotion] =
    useState(null);

  const [xA, setXA] = useState([]);
  const [yA, setYA] = useState([]);
  const [zA, setZA] = useState([]);

  const [xAG, setXAG] = useState([]);
  const [yAG, setYAG] = useState([]);
  const [zAG, setZAG] = useState([]);

  // const [xR, setXR] = useState([]);
  // const [yR, setYR] = useState([]);
  // const [zR, setZR] = useState([]);

  const [xAGH, setXAGH] = useState([]);
  const [yAGH, setYAGH] = useState([]);
  const [zAGH, setZAGH] = useState([]);

  const _subscribe = () => {
    setSubscriptionDeviceMotion(
      DeviceMotion.addListener((result) => {
        setAcceleration(result.acceleration);
        setAccelerationIncludingGravity(result.accelerationIncludingGravity);
        setRotation(result.rotation);
        // setRotationRate(result.rotationRate);
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
    setXA((prevXA) => [...prevXA, x_A]);
    setYA((prevYA) => [...prevYA, y_A]);
    setZA((prevZA) => [...prevZA, z_A]);
    setXAG((prevXAG) => [...prevXAG, x_AG]);
    setYAG((prevYAG) => [...prevYAG, y_AG]);
    setZAG((prevZAG) => [...prevZAG, z_AG]);
    // setXR((prevXR) => [...prevXR, x_R]);
    // setYR((prevYR) => [...prevYR, y_R]);
    // setZR((prevZR) => [...prevZR, z_R]);

    const a_rotate = [x_AG, y_AG, z_AG];
    const result1 = rotationMatrix(a_rotate, rotation.beta, rotation.gamma);
    setXAGH((prevXAGH) => [...prevXAGH, result1["_data"][0]]);
    setYAGH((prevYAGH) => [...prevYAGH, result1["_data"][1]]);
    setZAGH((prevZAGH) => [...prevZAGH, result1["_data"][2]]);
  }, [accelerationIncludingGravity]);

  const plotAcceleration = () => {
    _unsubscribe();
    navigation.navigate("Plot Acceleration", {
      xA:
        xA.length >= 250
          ? xA.slice(xA.length - 250, xA.length)
          : xA.slice(1, xA.length),
      yA:
        yA.length >= 250
          ? yA.slice(yA.length - 250, yA.length)
          : yA.slice(1, yA.length),
      zA:
        zA.length >= 250
          ? zA.slice(zA.length - 250, zA.length)
          : zA.slice(1, zA.length),
    });
  };

  const plotAccelerationIncludingGravity = () => {
    _unsubscribe();
    navigation.navigate("Plot Acceleration Including Gravity", {
      xAG:
        xAG.length >= 250
          ? xAG.slice(xAG.length - 250, xAG.length)
          : xAG.slice(1, xAG.length),
      yAG:
        yAG.length >= 250
          ? yAG.slice(yAG.length - 250, yAG.length)
          : yAG.slice(1, yAG.length),
      zAG:
        zAG.length >= 250
          ? zAG.slice(zAG.length - 250, zAG.length)
          : zAG.slice(1, zAG.length),
    });
  };

  const plotRotatedAccelerationIncludingGravity = () => {
    _unsubscribe();
    navigation.navigate("Plot Rotated Acceleration Including Gravity", {
      xAGH:
        xAGH.length >= 250
          ? xAGH.slice(xAGH.length - 250, xAGH.length)
          : xAGH.slice(1, xAGH.length),
      yAGH:
        yAGH.length >= 250
          ? yAGH.slice(yAGH.length - 250, yAGH.length)
          : yAGH.slice(1, yAGH.length),
      zAGH:
        zAGH.length >= 250
          ? zAGH.slice(zAGH.length - 250, zAGH.length)
          : zAGH.slice(1, zAGH.length),
    });
  };

  const plotFilteredAccelerationIncludingGravity = () => {
    _unsubscribe();
    navigation.navigate("Plot Filtered Acceleration Including Gravity", {
      xAG:
        xAG.length >= 250
          ? xAG.slice(xAG.length - 250, xAG.length)
          : xAG.slice(1, xAG.length),
      yAG:
        yAG.length >= 250
          ? yAG.slice(yAG.length - 250, yAG.length)
          : yAG.slice(1, yAG.length),
      zAG:
        zAG.length >= 250
          ? zAG.slice(zAG.length - 250, zAG.length)
          : zAG.slice(1, zAG.length),
    });
  };

  const plotRotation = () => {
    _unsubscribe();
    navigation.navigate("PlotDeviceMotionRotationScreen", {
      xR:
        xR.length >= 250
          ? xR.slice(xR.length - 250, xR.length)
          : xR.slice(1, xR.length),
      yR:
        yR.length >= 250
          ? yR.slice(yR.length - 250, yR.length)
          : yR.slice(1, yR.length),
      zR:
        zR.length >= 250
          ? zR.slice(zR.length - 250, zR.length)
          : zR.slice(1, zR.length),
    });
  };

  const resetData = () => {
    _unsubscribe();
    setSample(-1);
    setAcceleration({ x: 0, y: 0, z: 0 });
    setAccelerationIncludingGravity({ x: 0, y: 0, z: 0 });
    setXA([]);
    setYA([]);
    setZA([]);
    // setRotation({ alpha: 0, beta: 0, gamma: 0 });
    // setRotationRate({ alpha: 0, beta: 0, gamma: 0 });
  };

  const x_A = acceleration.x / G;
  const y_A = acceleration.y / G;
  const z_A = acceleration.z / G;

  const x_AG = accelerationIncludingGravity.x / G;
  const y_AG = accelerationIncludingGravity.y / G;
  const z_AG = accelerationIncludingGravity.z / G;

  // const z_R = (rotation.alpha * 180) / pi;
  // const x_R = (rotation.beta * 180) / pi;
  // const y_R = (rotation.gamma * 180) / pi;

  // const x_RR = rotationRate.alpha;
  // const y_RR = rotationRate.beta;
  // const z_RR = rotationRate.gamma;

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>Acceleration: </Text>
      <Text style={styles.text}>
        x: {round(x_A)} y: {round(y_A)} z: {round(z_A)}
      </Text> */}
      {/* <Text style={styles.text}>Acceleration Including Gravity: </Text>
      <Text style={styles.text}>
        x: {round(x_AG)} y: {round(y_AG)} z: {round(z_AG)}
      </Text> */}
      {/* <Text style={styles.text}>Rotation: </Text>
      <Text style={styles.text}>
        x: {round(x_R)} y: {round(y_R)} z: {round(z_R)}
      </Text> */}
      {/* <Text style={styles.text}>Rotation Rate: </Text>
      <Text style={styles.text}>
        x: {round(x_RR)} y: {round(y_RR)} z: {round(z_RR)}
      </Text> */}
      {/* <Text style={styles.text}>Ground Acceleration Including Gravity : </Text>
      <Text style={styles.text}>
        x: {round(xAGH[xAGH.length - 1])} y: {round(yAGH[yAGH.length - 1])} z:{" "}
        {round(zAGH[zAGH.length - 1])}
      </Text> */}
      <Text style={styles.text}>Sample: {sample} </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={subscriptionDeviceMotion ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{subscriptionDeviceMotion ? "Off" : "On"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={plotAcceleration} style={styles.button}>
          <Text>Plot Acceleration Data</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={plotAccelerationIncludingGravity}
          style={styles.button}
        >
          <Text>Plot Acceleration Including Gravity Data</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={plotRotation} style={styles.button}>
          <Text>Plot Rotation Data</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={plotRotatedAccelerationIncludingGravity}
          style={styles.button}
        >
          <Text>Plot Ground Acceleration Including Gravity Data</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={plotFilteredAccelerationIncludingGravity}
          style={styles.button}
        >
          <Text>Plot Filtered Acceleration Including Gravity Data</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={resetData} style={styles.button}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
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
});
