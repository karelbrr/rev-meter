import { useState, useEffect, useRef } from "react";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useFrameOutput,
  CommonResolutions
} from "react-native-vision-camera";
import { useTextRecognition } from "react-native-vision-camera-mlkit";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  useAnimatedReaction,
  runOnJS,
  Extrapolation,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function HomeScreen() {
  const [displayRpm, setDisplayRpm] = useState(800);
  const rpm = useSharedValue(800); // 800 RPM Idle

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  
  const { textRecognition } = useTextRecognition({
    language: 'LATIN',
    scaleFactor: 1,
    invertColors: false,
  });

  const frameOutput = useFrameOutput({
    targetResolution: CommonResolutions.VGA_16_9,
    pixelFormat: 'yuv',
    onFrame(frame) {
      'worklet';
      try {
        const result = textRecognition(frame, {
          outputOrientation: 'portrait',
        });
        // Log the detected text to terminal to verify it's working
        if (result.text && result.text.length > 0) {
          console.log("OCR Detected:", result.text.replace(/\n/g, ' '));
        }
      } finally {
        frame.dispose();
      }
    },
  });

  const player = useAudioPlayer(require("../../assets/engine.mp3"));
  const lastRateUpdate = useRef(0);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    async function configureAudio() {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: "mixWithOthers",
      });
      player.loop = true;
      player.shouldCorrectPitch = false;
      player.play();
    }
    configureAudio();
  }, [player]);

  const updateSoundRate = (currentRpm: number) => {
    const now = Date.now();
    // Throttle sound rate updates to avoid stuttering
    if (
      now - lastRateUpdate.current > 100 ||
      currentRpm === 800 ||
      currentRpm === 9000
    ) {
      lastRateUpdate.current = now;
      // Map 800 - 9000 RPM to 1.0x - 3.0x speed
      const rate = 1.0 + ((currentRpm - 800) / (9000 - 800)) * 2.0;
      player.setPlaybackRate(Math.max(1.0, Math.min(rate, 3.0)));
    }
  };

  useAnimatedReaction(
    () => rpm.value,
    (currentValue, previousValue) => {
      // Throttle state updates to avoid too many re-renders on the JS thread
      if (
        Math.abs(currentValue - (previousValue || 0)) > 50 ||
        currentValue === 800 ||
        currentValue === 9000
      ) {
        runOnJS(setDisplayRpm)(Math.floor(currentValue));
        runOnJS(updateSoundRate)(currentValue);
      }
    },
  );

  const handlePressIn = () => {
    // Rev the engine to redline
    rpm.value = withTiming(9000, {
      duration: 1500, // A bit snappier rev
      easing: Easing.out(Easing.quad), // Immediate reaction, slowing down slightly near redline
    });
  };

  const handlePressOut = () => {
    // Drop back to idle, like letting off the gas
    rpm.value = withTiming(800, {
      duration: 1200, // Snappier drop
      easing: Easing.out(Easing.cubic), // Smooth drop that doesn't hang near the bottom
    });
  };

  const animatedGaugeStyle = useAnimatedStyle(() => {
    // Map 0 - 9000 RPM to a rotation angle (-135deg to 135deg is a 270 degree sweep)
    const rotation = interpolate(
      rpm.value,
      [0, 9000],
      [-135, 135],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rev Meter</Text>
          <View style={styles.statusDot} />
        </View>

        {/* Rev Meter Gauge */}
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeTrack}>
            {hasPermission && device ? (
              <View style={styles.cameraContainer}>
                <Camera 
                  style={{ flex: 1 }} 
                  device={device} 
                  isActive={true} 
                  outputs={[frameOutput]} 
                  constraints={[{ resolutionBias: frameOutput }]}
                />
              </View>
            ) : (
              <View style={[styles.cameraContainer, { backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#888', fontSize: 12, fontWeight: 'bold' }}>CAMERA OFF</Text>
              </View>
            )}
            <View style={styles.gaugeFill} />
            <View style={styles.gaugeTickMarks} />

            <Animated.View style={[styles.needleContainer, animatedGaugeStyle]}>
              <View style={styles.needlePivot}>
                <View style={styles.needle} />
              </View>
            </Animated.View>

            <View style={styles.needleDot} />

            <View style={styles.centerDisplay}>
              <Text style={styles.rpmText}>{displayRpm.toLocaleString()}</Text>
              <Text style={styles.rpmLabel}>RPM</Text>
            </View>
          </View>
        </View>

        {/* Debug Button */}
        <Pressable
          style={styles.debugButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.debugButtonText}>Hold to Rev Engine</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark premium background
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#32D74B", // Connected status green
    shadowColor: "#32D74B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  gaugeTrack: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 20,
    borderColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: "hidden",
  },
  gaugeFill: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 20,
    // Creating a gradient-like effect using borders. It simulates a rev range.
    borderColor: "#FF3B30",
    borderTopColor: "#FF9500",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  gaugeTickMarks: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: "#333",
    borderStyle: "dashed",
  },
  needleContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  needlePivot: {
    width: 6,
    height: 280,
    alignItems: "center",
  },
  needle: {
    width: 6,
    height: 120,
    backgroundColor: "#FF3B30",
    borderRadius: 3,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  needleDot: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1C1C1E",
    borderWidth: 4,
    borderColor: "#FF3B30",
    zIndex: 11,
  },
  centerDisplay: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
  },
  rpmText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rpmLabel: {
    fontSize: 20,
    color: "#8E8E93",
    marginTop: -5,
    letterSpacing: 3,
    fontWeight: "500",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    gap: 30,
  },
  detailBox: {
    alignItems: "center",
  },
  detailLabel: {
    color: "#8E8E93",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 5,
    fontWeight: "600",
  },
  detailValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  detailUnit: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#333",
  },
  gearContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    backgroundColor: "#1C1C1E",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  gearText: {
    fontSize: 24,
    color: "#4A4A4C",
    fontWeight: "bold",
  },
  activeGear: {
    color: "#0A84FF", // Bright blue for active gear
    fontSize: 32,
    textShadowColor: "rgba(10, 132, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  debugButton: {
    backgroundColor: "#32D74B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 20,
  },
  debugButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
