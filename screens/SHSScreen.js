import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DeviceMotion, Magnetometer } from "expo-sensors";
import round from "../components/round";
import { atan, atan2, cos, pi, sin } from "mathjs";
import rotationMatrix from "../components/rotationMatrix";
import detect from "../components/detect";
import movingAverageFilter from "../components/movingAverageFilter";

import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function SHSScreen({ navigation, route }) {
  const { k } = route.params;

  let x = 0;
  let y = 0;

  const SAMPLE_DETECT = 50;
  const K = 10;
  const G = 9.80665;
  const [sample, setSample] = useState(-1);
  const [step, setStep] = useState(0);
  const [distance, setDistance] = useState(0);

  const [data, setData] = useState([{ step: 0, x: 0, y: 0 }]);

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

  // const [magnetic, setMagnetic] = useState({
  //   x: 0,
  //   y: 0,
  //   z: 0,
  // });

  // const [headingMagnetic, setHeadingMagnetic] = useState(0);

  const [subscriptionDeviceMotion, setSubscriptionDeviceMotion] =
    useState(null);

  // const [subscriptionMagnetometer, setSubscriptionMagnetometer] =
  //   useState(null);

  const [zAH, setZAH] = useState([]);
  const [yaw, setYaw] = useState([]);

  const _subscribe = () => {
    setSubscriptionDeviceMotion(
      DeviceMotion.addListener((result) => {
        setAcceleration(result.acceleration);
        setRotation(result.rotation);
      })
    );
    // setSubscriptionMagnetometer(
    //   Magnetometer.addListener((result) => {
    //     setMagnetic(result);
    //   })
    // );
    DeviceMotion.setUpdateInterval(20);
    // Magnetometer.setUpdateInterval(20);
  };

  const _unsubscribe = () => {
    subscriptionDeviceMotion && subscriptionDeviceMotion.remove();
    // subscriptionMagnetometer && subscriptionMagnetometer.remove();
    setSubscriptionDeviceMotion(null);
    // setSubscriptionMagnetometer(null);
  };

  useEffect(() => {
    setSample((prevSample) => prevSample + 1);
    setYaw((prevYaw) => [...prevYaw, rotation.alpha]);
    const a_rotate = [x_A, y_A, z_A];
    const result1 = rotationMatrix(a_rotate, rotation.beta, rotation.gamma);
    // const m_rotate = [x_M, y_M, z_M];
    // const result2 = rotationMatrix(m_rotate, rotation.beta, rotation.gamma);
    // setHeadingMagnetic(
    //   (atan2(result2["_data"][1], result2["_data"][0]) * 180) / pi
    // );
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
      const stepTemp = detect(filteredZAH, K, yawData, k);

      if (stepTemp.length >= 1) {
        for (let value of stepTemp) {
          setData((prevData) => {
            prevData.push({
              step: prevData[prevData.length - 1].step + 1,
              x:
                prevData[prevData.length - 1].x + value.sl * cos(value.heading),
              y:
                prevData[prevData.length - 1].y + value.sl * sin(value.heading),
            });
            return prevData;
          });
        }
      }
    }
  }, [acceleration]);

  const testScreen = () => {
    _unsubscribe();
    navigation.navigate("TestScreen", {
      zAH:
        zAH.length >= SAMPLE_DETECT + 2 * K
          ? zAH.slice(zAH.length - (SAMPLE_DETECT + 2 * K), zAH.length)
          : zAH.slice(1, zAH.length),
      K: K,
      yaw:
        yaw.length >= SAMPLE_DETECT + 2 * K
          ? yaw.slice(yaw.length - (SAMPLE_DETECT + 2 * K), yaw.length)
          : yaw.slice(1, yaw.length),
      k: k,
    });
  };

  const displayResult = async () => {
    _unsubscribe();
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri = FileSystem.cacheDirectory + "data.xlsx";

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Data",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  const resetData = () => {
    _unsubscribe();
    setSample(-1);
    setAcceleration({ x: 0, y: 0, z: 0 });
    setRotation({ alpha: 0, beta: 0, gamma: 0 });
    setZAH([]);
    setStep(0);
    setDistance(0);
    setYaw([]);
    setData([{ step: 0, x: 0, y: 0 }]);
  };

  const x_A = acceleration.x / G;
  const y_A = acceleration.y / G;
  const z_A = acceleration.z / G;

  // const x_M = magnetic.x;
  // const y_M = magnetic.y;
  // const z_M = magnetic.z;
  const heading = Math.trunc((rotation.alpha * 180) / pi);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sample: {sample} </Text>

      {/* <Text style={styles.text}>Heading: </Text>
      <Text style={styles.text}>{round(headingMagnetic)}</Text> */}

      <Text style={styles.text}>Calibration Factor: {k} </Text>
      <Text style={styles.text}>Currently Heading: {heading} degree</Text>

      <Text style={styles.text}>
        Step: {round(data[data.length - 1].step)} x:{" "}
        {round(data[data.length - 1].x)} y: {round(data[data.length - 1].y)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={subscriptionDeviceMotion ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{subscriptionDeviceMotion ? "Off" : "On"}</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={testScreen} style={styles.button}>
          <Text>Test</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={displayResult} style={styles.button}>
          <Text>Export data</Text>
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
