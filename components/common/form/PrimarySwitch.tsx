import React from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import { useController, useFormContext } from "react-hook-form";
import Colors from "../../../theme/colors";

export interface PrimarySwitchProps {
  name: string;
  label: string;
  defaultValue: boolean;
}

const PrimarySwitch = (props: PrimarySwitchProps) => {
  const { name, label, defaultValue } = props;
  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext
      ? "Switch must be wrapped by the FormProvider"
      : "Name must be defined";
    console.error(msg);
    return null;
  }

  return (
    <ControlledSwitch name={name} label={label} defaultValue={defaultValue} />
  );
};

const ControlledSwitch = ({
  name,
  label,
  defaultValue,
}: PrimarySwitchProps) => {
  const { field } = useController({
    name,
    defaultValue,
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Switch onValueChange={field.onChange} value={field.value} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: Colors.gray[900],
    fontWeight: "bold",
  },
});

export default PrimarySwitch;
