import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  FlatList, Image,
} from 'react-native';
import Button from '../../../components/common/form/Button';
import Colors from '../../../theme/colors';
import LText from '../../common/Text';
import LanguageSelection from './LanguageSelection';
import { useSetUserLanguageMutation } from '../userApi';
import useNotifications from "../../../hooks/useNotifications";

const languages = [
  { name: 'English', code: 'ENG', flag: require('../../../assets/lang/eng.png'), isBeta: false },
  { name: 'Turkish', code: 'TUR', flag: require('../../../assets/lang/tur.png'), isBeta: true },
  { name: 'Spanish', code: 'ESP', flag: require('../../../assets/lang/esp.png'), isBeta: true },
  { name: 'Italian', code: 'ITA', flag: require('../../../assets/lang/ita.png'), isBeta: true },
  { name: 'German', code: 'GER', flag: require('../../../assets/lang/ger.png'), isBeta: true },
  { name: 'French', code: 'FRA', flag: require('../../../assets/lang/fra.png'), isBeta: true },
  { name: 'Korean', code: 'KOR', flag: require('../../../assets/lang/kor.png'), isBeta: true },
];

const ChangeLanguage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedVisibleLanguage, setSelectedVisibleLanguage] = useState('ENG');
  const [selectedVisibleLanguageFlag, setSelectedVisibleLanguageFlag] = useState(require('../../../assets/lang/eng.png'));
  const { add, remove } = useNotifications();

  const [mutateUserLanguage, { isError: isUserLanguageError, error: userLanguageError, isLoading: isUserLanguageLoading }] =
    useSetUserLanguageMutation();

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
  };

  const handleConfirm = async () => {
    const selectedLanguageObj = languages.find(language => language.name === selectedLanguage);

    const response = await mutateUserLanguage(
      {
        language: selectedLanguageObj.code.toUpperCase(),
      }
    );

    if (response && response.data && response.data.language) {
      const responseLanguageObj = languages.find(language => language.code === response.data.language.toUpperCase());
      const responseLanguageName = responseLanguageObj ? responseLanguageObj.name : null;

      if (responseLanguageObj) {
        setSelectedVisibleLanguage(responseLanguageObj.code);
        setSelectedVisibleLanguageFlag(responseLanguageObj.flag);
      }

      add({
        type: 'success',
        body: `Changed language to ${responseLanguageName}.`,
        time: 3000,
      });
    }

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.root}
        onPress={() => setModalVisible(true)}
      >
        <Image source={selectedVisibleLanguageFlag} style={styles.flag} />
      </TouchableOpacity>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LText style={styles.modalTitle}>Select Language</LText>
            <LText style={styles.modalSubtitle} centered={true}>Linguist bots will speak to you in the language you select below</LText>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleLanguageSelect(item)}
                >
                  <LanguageSelection
                    flag={item.flag}
                    isBeta={item.isBeta}
                    languageName={item.name}
                    languageCode={item.code}
                    isSelected={selectedLanguage === item.name}
                  />
                </TouchableOpacity>
              )}
            />
            <View style={styles.bottomButtons}>
              <View style={styles.button}>
                <Button loading={isUserLanguageLoading} type='primary' color={'primary'} onPress={handleConfirm}>Confirm</Button>
              </View>
              <View style={styles.button}>
                <Button loading={isUserLanguageLoading} loadingColor={Colors.primary[500]} type='outlined' color={'primary'} onPress={() => setModalVisible(false)}>Cancel</Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  root: {
    marginTop: 10,
    backgroundColor: Colors.gray[200],
    width: 54,
    height: 39,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.gray[200],
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  languageItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  languageItemSelection: {
    fontWeight: 'bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 20,
  },
  button: {
    minWidth: 100,
  },
});

export default ChangeLanguage;
