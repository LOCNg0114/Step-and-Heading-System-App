import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import movingAverageFilter from "../components/movingAverageFilter";
import { v4 as uuidv4 } from "uuid";
import { findVariance } from "../components/findStandardDeviation";
import round from "../components/round";

export default function TestScreen({ navigation, route }) {
  const { zAH, K, yaw, k } = route.params;

  let xlabel = [];
  for (let i = 0; i < zAH.length; i++) {
    xlabel.push(i);
  }

  const filteredZAH = movingAverageFilter(zAH, 5);

  const DYNAMIC_THRESHOLDING = 0.05;
  const MAGNITUDE_THRESHOLD = 0.1;
  const VARIANCE_STEP = 0.01;
  const WINDOW = 25;
  const a = (f) => 0.0000545 * f * f - 0.00501 * f + 0.15495; // f tang a giam
  const b = (f) => -0.0000461 * f * f + 0.00404 * f - 0.13; // f tang b tang
  const c = (f) => 0.0000102 * f * f - 0.000913 * f + 0.0336; // f tang c giam

  let peak = [];

  for (let i = K; i < filteredZAH.length - K; i++) {
    if (
      filteredZAH[i] > Math.max(...filteredZAH.slice(i - K, i)) &&
      filteredZAH[i] > Math.max(...filteredZAH.slice(i + 1, i + K + 1))
    ) {
      let window = Math.floor((i - K) / WINDOW);
      let minPeak = Math.min(
        ...filteredZAH.slice(K + window * WINDOW, K + window * WINDOW + WINDOW)
      );
      let maxPeak = Math.max(
        ...filteredZAH.slice(K + window * WINDOW, K + window * WINDOW + WINDOW)
      );
      let dynamicThresholding = (minPeak + maxPeak) / 2;

      let variance = findVariance(
        filteredZAH.slice(K + window * WINDOW, K + window * WINDOW + WINDOW)
      );

      peak.push({
        mag: filteredZAH[i],
        // time: (loop - 1) * (data.length - 2 * K) + i,
        // minPeak: minPeak,
        // maxPeak: maxPeak,
        variance: variance,
        index: i,
        heading: yaw[i],
        // window: (loop * (data.length - 2 * K)) / WINDOW + window,
        dynamicThresholding: dynamicThresholding,
      });
    }
  }

  // peak = peak.filter((item) => item.variance >= VARIANCE_STEP);

  peak = peak.filter((item) => item.mag >= MAGNITUDE_THRESHOLD);

  peak = peak.filter(
    (item) => item.mag - item.dynamicThresholding >= DYNAMIC_THRESHOLDING
  );

  const stepF = peak.length * 24;
  for (let i = 0; i < peak.length; i++) {
    if (stepF > 0) {
      peak[i].sl = round(
        (k *
          (-b(stepF) +
            Math.sqrt(
              b(stepF) * b(stepF) - 4 * a(stepF) * (c(stepF) - peak[i].variance)
            ))) /
          (2 * a(stepF))
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
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
                    {
                      data: zAH,
                      color: (opacity = 1) => `rgba(255,0,0,${opacity})`, //red
                    },
                    {
                      data: filteredZAH,
                      color: (opacity = 1) => `rgba(0,255,0, ${opacity})`, //green
                    },
                  ],
                  legend: ["Data", "Filtered Data"],
                }}
                formatXLabel={(value) => (value % 50 == 0 ? value : "")}
                withDots={false}
                withVerticalLines={false}
                width={Dimensions.get("window").width} // from react-native
                height={250}
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
      <View style={styles.flatList}>
        <FlatList
          data={peak}
          renderItem={({ item }) => (
            <View style={styles.flatListItem}>
              <Text> Time Stamp: {round(item.index)} </Text>
              <Text> Step length: {round(item.sl)} </Text>
              <Text> Heading: {round(item.heading)} </Text>
              {/* <Text> Mag: {round(item.mag)} </Text> */}
              {/* <Text> Variance: {round(item.variance)} </Text> */}
              {/* <Text>
                {" "}
                DynamicThresholding: {round(item.dynamicThresholding)}{" "}
              </Text> */}
            </View>
          )}
          keyExtractor={(item) => uuidv4()}
          numColumns={2}
          ListEmptyComponent={() => (
            <Text style={styles.text}> No peak detected</Text>
          )}
          columnWrapperStyle={styles.flatListColumn}
        />
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
  flatList: {
    marginTop: 10,
    justifyContent: "center",
    flex: 1,
  },
  flatListItem: {
    flex: 1,
    marginTop: 10,
    alignItems: "flex-start",
  },
  flatListColumn: {
    justifyContent: "space-between",
    flex: 1,
    marginHorizontal: 5,
  },
});
