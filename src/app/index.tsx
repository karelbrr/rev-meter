import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function HomeScreen() {
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
            <View style={styles.gaugeFill} />
            <View style={styles.gaugeTickMarks} />
            
            <View style={styles.centerDisplay}>
              <Text style={styles.rpmText}>6,200</Text>
              <Text style={styles.rpmLabel}>RPM</Text>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>SPEED</Text>
            <Text style={styles.detailValue}>124 <Text style={styles.detailUnit}>km/h</Text></Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>TEMP</Text>
            <Text style={styles.detailValue}>90 <Text style={styles.detailUnit}>°C</Text></Text>
          </View>
        </View>

        {/* Gear Indicator */}
        <View style={styles.gearContainer}>
          <Text style={styles.gearText}>P</Text>
          <Text style={styles.gearText}>R</Text>
          <Text style={styles.gearText}>N</Text>
          <Text style={[styles.gearText, styles.activeGear]}>D</Text>
          <Text style={styles.gearText}>S</Text>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark premium background
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#32D74B', // Connected status green
    shadowColor: '#32D74B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  gaugeTrack: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 20,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  gaugeFill: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 20,
    // Creating a gradient-like effect using borders. It simulates a rev range.
    borderColor: '#FF3B30', 
    borderTopColor: '#FF9500', 
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  gaugeTickMarks: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  centerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpmText: {
    fontSize: 72,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rpmLabel: {
    fontSize: 20,
    color: '#8E8E93',
    marginTop: -5,
    letterSpacing: 3,
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    gap: 30,
  },
  detailBox: {
    alignItems: 'center',
  },
  detailLabel: {
    color: '#8E8E93',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 5,
    fontWeight: '600',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  detailUnit: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#333',
  },
  gearContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    backgroundColor: '#1C1C1E',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  gearText: {
    fontSize: 24,
    color: '#4A4A4C',
    fontWeight: 'bold',
  },
  activeGear: {
    color: '#0A84FF', // Bright blue for active gear
    fontSize: 32,
    textShadowColor: 'rgba(10, 132, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
