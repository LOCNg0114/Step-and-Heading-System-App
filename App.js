import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import RootScreen from "./screens/RootScreen";
import DeviceMotionScreen from "./screens/DeviceMotionScreen";
import PlotDeviceMotionAccelerationScreen from "./screens/PlotDeviceMotionAccelerationScreen";
import PlotDeviceMotionAccelerationIncludingGravityScreen from "./screens/PlotDeviceMotionAccelerationIncludingGravityScreen";
import PlotDeviceMotionRotationScreen from "./screens/PlotDeviceMotionRotationScreen";
import PlotDeviceMotionRotatedAccelerationIncludingGravityScreen from "./screens/PlotDeviceMotionRotatedAccelerationIncludingGravityScreen";
import PlotDeviceMotionFilteredAccelerationIncludingGravityScreen from "./screens/PlotDeviceMotionFilteredAccelerationIncludingGravityScreen";
import SHSScreen from "./screens/SHSScreen";
import TestScreen from "./screens/TestScreen";
import CalibrateStepLengthScreen from "./screens/CalibrateStepLengthScreen";

const DeviceMotionStack = createStackNavigator();
function DeviceMotionStackScreen() {
  return (
    <DeviceMotionStack.Navigator>
      <DeviceMotionStack.Screen
        name="Device Motion"
        component={DeviceMotionScreen}
      />
      <DeviceMotionStack.Screen
        name="Plot Acceleration"
        component={PlotDeviceMotionAccelerationScreen}
      />
      <DeviceMotionStack.Screen
        name="Plot Acceleration Including Gravity"
        component={PlotDeviceMotionAccelerationIncludingGravityScreen}
      />
      <DeviceMotionStack.Screen
        name="Plot Rotated Acceleration Including Gravity"
        component={PlotDeviceMotionRotatedAccelerationIncludingGravityScreen}
      />
      <DeviceMotionStack.Screen
        name="Plot Filtered Acceleration Including Gravity"
        component={PlotDeviceMotionFilteredAccelerationIncludingGravityScreen}
      />
      <DeviceMotionStack.Screen
        name="PlotDeviceMotionRotationScreen"
        component={PlotDeviceMotionRotationScreen}
      />
    </DeviceMotionStack.Navigator>
  );
}

const SHSStack = createStackNavigator();
function SHSStackScreen() {
  return (
    <SHSStack.Navigator>
      <SHSStack.Screen
        name="Calibrate Step Length"
        component={CalibrateStepLengthScreen}
      />
      <SHSStack.Screen name="SHSScreen" component={SHSScreen} />
      <SHSStack.Screen name="TestScreen" component={TestScreen} />
    </SHSStack.Navigator>
  );
}

const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="RootScreen" component={RootScreen} /> */}
      <Stack.Screen name="DeviceMotion" component={DeviceMotionStackScreen} />
      <Stack.Screen name="SHS" component={SHSStackScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      {/* <MyStack /> */}
      {/* <DeviceMotionStackScreen /> */}
      <SHSStackScreen />
    </NavigationContainer>
  );
}
