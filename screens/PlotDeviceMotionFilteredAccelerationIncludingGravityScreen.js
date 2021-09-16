import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { findStandardDeviation } from "../components/findStandardDeviation";
import movingAverageFilter from "../components/movingAverageFilter";
import round from "../components/round";

export default function PlotDeviceMotionFilteredAccelerationIncludingGravityScreen({
  navigation,
  route,
}) {
  const { xAG, yAG, zAG } = route.params;

  let xlabel = [];
  for (let i = 0; i < xAG.length; i++) {
    xlabel.push(i);
  }

  const stdX = findStandardDeviation(xAG);
  const stdY = findStandardDeviation(yAG);
  const stdZ = findStandardDeviation(zAG);

  const filterXAG = movingAverageFilter(xAG, 5);
  const filterYAG = movingAverageFilter(yAG, 5);
  const filterZAG = movingAverageFilter(zAG, 5);

  const stdFilteredX = findStandardDeviation(filterXAG);
  const stdFilteredY = findStandardDeviation(filterYAG);
  const stdFilteredZ = findStandardDeviation(filterZAG);

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <ScrollView style={styles.graphContainer}>
          <View style={styles.graph}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <LineChart
                data={{
                  labels: xlabel,
                  datasets: [
                    // {
                    //   data: filterXAG,
                    //   color: (opacity = 1) => `rgba(255,0,0,${opacity})`, //red
                    // },
                    // {
                    //   data: filterYAG,
                    //   color: (opacity = 1) => `rgba(0,255,0, ${opacity})`, //green
                    // },
                    {
                      data: zAG,
                      color: (opacity = 1) => `rgba(0,255,0, ${opacity})`, //blue
                    },
                    {
                      data: filterZAG,
                      color: (opacity = 1) => `rgba(255,0,0, ${opacity})`, //blue
                    },
                  ],
                  legend: ["Z", "Filtered Z"],
                }}
                formatXLabel={(value) => (value % 50 == 0 ? value : "")}
                withDots={false}
                withVerticalLines={false}
                width={Dimensions.get("window").width * 2} // from react-native
                height={200}
                chartConfig={{
                  backgroundGradientFrom: "#1E2923",
                  backgroundGradientTo: "#08130D",
                  fillShadowGradient: "#fff",
                  decimalPlaces: 3, // optional, defaults to 2dp
                  color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                }}
                style={{
                  marginVertical: 2,
                  borderRadius: 10,
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>Standard Deviation before filtering: </Text>
        <Text style={styles.text}>
          x: {round(stdX)} y: {round(stdY)} z: {round(stdZ)}
        </Text>
        <Text style={styles.text}>Standard Deviation after filtering: </Text>
        <Text style={styles.text}>
          x: {round(stdFilteredX)} y: {round(stdFilteredY)} z:{" "}
          {round(stdFilteredZ)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graphContainer: {
    flex: 1,
  },
  graph: {
    marginVertical: 5,
  },
  graphName: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
  },
});
