import { DimensionValue, StyleSheet, Text, View } from "react-native";
import Colors from "../../../../theme/colors";

interface StrengthMeterProps {
  numOfRequirements: number;
  numOfMetRequirements: number;
}

const BASE_METER_WIDTH_PERCENTAGE = 10;

const StrengthMeter = (props: StrengthMeterProps) => {
  const { numOfRequirements, numOfMetRequirements } = props;

  const getStrengthLabel = () => {
    if (numOfMetRequirements === 0) {
      return {
        text: "Weak",
        color: Colors.red[600],
      };
    } else if (numOfMetRequirements === numOfRequirements) {
      return {
        text: "Strong",
        color: Colors.green[600],
      };
    } else if (numOfMetRequirements > numOfRequirements / 2) {
      return {
        text: "Average",
        color: Colors.orange[600],
      };
    } else {
      return {
        text: "Weak",
        color: Colors.red[600],
      };
    }
  }

  const { text, color } = getStrengthLabel();

  const renderStrengthLabel = () => {
    return <Text style={[styles.strengthLabel, { color }]}>{text}</Text>;
  }

  const getStrengthMeterBarWidth = (): DimensionValue => {
    if (numOfMetRequirements === 0) {
      return `${BASE_METER_WIDTH_PERCENTAGE}%`
    }

    return `${(numOfMetRequirements / numOfRequirements) * 100}%`
  }

  return (
    <View style={styles.strengthMeterContainer}>
      <View style={styles.strengthMeterBarContainer}>
        <View
          style={[
            styles.meter,
            { width: getStrengthMeterBarWidth(), 
            backgroundColor: color,
          },
            
          ]}
        />
      </View>
      {renderStrengthLabel()}
    </View>
  );
};

const styles = StyleSheet.create({
  strengthMeterContainer: {
    gap: 10,
    display: "flex",
    flexDirection: "column",
  },
  strengthMeterBarContainer: {
    maxWidth: "100%",
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gray[100],
  },
  meter: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: Colors.green[600],
  },
  strengthLabel: {
    fontSize: 14,
    alignSelf: "flex-end",
    fontWeight: "bold"
  }
});

export default StrengthMeter;
