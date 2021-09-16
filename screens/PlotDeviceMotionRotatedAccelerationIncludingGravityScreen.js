import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function PlotDeviceMotionRotatedAccelerationIncludingGravityScreen({
  navigation,
  route,
}) {
  const { xAGH, yAGH, zAGH } = route.params;

  let xlabel = [];
  for (let i = 0; i < xAGH.length; i++) {
    xlabel.push(i);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.graphContainer}>
        <View style={styles.graph}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <LineChart
              data={{
                labels: xlabel,
                datasets: [
                  {
                    data: xAGH,
                    color: (opacity = 1) => `rgba(255,0,0,${opacity})`, //red
                  },
                  {
                    data: yAGH,
                    color: (opacity = 1) => `rgba(0,255,0, ${opacity})`, //green
                  },
                  {
                    data: zAGH,
                    color: (opacity = 1) => `rgba(0,0,255, ${opacity})`, //blue
                  },
                ],
                legend: ["X", "Y", "Z"],
              }}
              formatXLabel={(value) => (value % 50 == 0 ? value : "")}
              withDots={false}
              withVerticalLines={false}
              width={Dimensions.get("window").width * 2} // from react-native
              height={250}
              chartConfig={{
                backgroundGradientFrom: "#1E2923",
                backgroundGradientTo: "#08130D",
                fillShadowGradient: "#fff",
                decimalPlaces: 3, // optional, defaults to 2dp
                color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
});
