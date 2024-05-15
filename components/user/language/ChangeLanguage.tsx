import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
  Button,
} from "react-native";
import Colors from "../../../theme/colors";
import LText from "../../common/Text";
import LanguageSelection from "./LanguageSelection";

const ChangeLanguage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedVisibleLanguage, setSelectedVisibleLanguage] = useState("ENG");

  const languages = [
    { name: "English", code: "ENG", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png", isBeta: false },
    { name: "Spanish", code: "ESP", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png", isBeta: true },
    { name: "Italian", code: "ITA", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png", isBeta: false },
    { name: "German", code: "GER", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png", isBeta: false },
    { name: "French", code: "FRA", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/800px-Flag_of_the_United_Kingdom_%281-2%29.svg.png", isBeta: true },
  ];
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    setSelectedVisibleLanguage(language.code);
  };

  const handleConfirm = () => {
    // Call a function to change the language
    console.log("Selected Language:", selectedLanguage);

    const selectedLanguageObj = languages.find(language => language.name === selectedLanguage);
    if (selectedLanguageObj) {
      setSelectedVisibleLanguage(selectedLanguageObj.code);
    }

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.root}
        onPress={() => setModalVisible(true)}
      >
        <LText>{selectedVisibleLanguage}</LText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LText style={styles.modalTitle}>Select Language</LText>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    {
                      backgroundColor:
                        selectedLanguage === item.name ? Colors.primary[500] : Colors.gray[300],
                    },
                  ]}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <LanguageSelection
                    flag={item.flag}
                    isBeta={item.isBeta}
                    languageName={item.name}
                    languageCode={item.code}
                  />
                </TouchableOpacity>
              )}
            />
            <Button title="Confirm" onPress={handleConfirm} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  root: {
    marginTop: 10,
    backgroundColor: Colors.gray[200],
    width: 70,
    height: 50,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: Colors.gray[300],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.gray[300],
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  languageItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: 150,
    alignItems: "center",
  },
  languageItemSelection: {
    fontWeight: 'bold',
  },
});

export default ChangeLanguage;
