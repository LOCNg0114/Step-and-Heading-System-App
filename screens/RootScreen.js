import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";

export default function RootScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Go to DeviceMotionScreen"
        onPress={() => navigation.navigate("DeviceMotion")}
      />
      <Button
        title="Go to SHS Screen"
        onPress={() => navigation.navigate("SHS")}
      />
    </View>
  );
}
