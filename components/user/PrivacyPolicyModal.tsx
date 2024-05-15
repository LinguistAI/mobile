import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import privacyPolicy from '../../assets/privacyPolicy.json';
import Colors from '../../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking } from 'react-native';

interface ListItem {
  title: string;
}

interface PrivacyPolicySection {
  title: string;
  content?: string | string[];
  list?: string[];
  subsections?: PrivacyPolicySection[];
}

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose
}) => {
  const renderText = (text: string | string[]) => {
    const splitText = Array.isArray(text) ? text : [text]; // Ensure text is an array
    
    return splitText.map((item, index) => {
      const parts = item.split(/(http[s]?:\/\/\S+)/); // Split text by URLs using regex
  
      return (
        <Text key={index} style={styles.text}>
          {parts.map((part, i) => {
            if (i % 2 === 0) {
              // Render plain text
              return <Text key={i}>{part}</Text>;
            } else {
              // Render clickable URL
              return (
                <TouchableOpacity key={i} onPress={() => openURL(part)}>
                  <Text style={{ color: 'blue'}}>{part}</Text>
                </TouchableOpacity>
              );
            }
          })}
        </Text>
      );
    });
};

  const renderList = (list: string[]) => {
    return list.map((item, index) => (
        <Text key={index} style={styles.listItem}>
            {'\u2022 '} {renderText(item)} 
        </Text>
    ));
  }

  const renderSubsections = (subsections: PrivacyPolicySection[]) => {
    return subsections.map((subsection, index) => (
      <View key={index}>
        <Text style={styles.subsectionTitle}>{subsection.title}</Text>
        {subsection.content && renderText(subsection.content)}
        {subsection.list && renderList(subsection.list)}
      </View>
    ));
  };

  const renderSections = (sections: PrivacyPolicySection[]) => {
    return sections.map((section, index) => (
      <View key={index}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {section.content && renderText(section.content)}
        {section.list && renderList(section.list)}
        {section.subsections && renderSubsections(section.subsections)}
      </View>
    ));
  };

  const openURL = async (url: string) => {
    try {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log("Cannot open URL: " + url);
        }
    } catch (error) {
        console.error("An error occurred while opening the URL: ", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <ScrollView>
            {renderSections(privacyPolicy.sections)}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.gray[0],
    padding: 20,
    borderRadius: 10,
    width: '85%',
    maxHeight: '80%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 14,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: Colors.primary[500],
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PrivacyPolicyModal;
