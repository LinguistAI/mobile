import { FlatList, StyleSheet, View } from "react-native";
import { TWordList } from "./types";
import FloatingButton from "../../components/common/FloatingButton";
import WordCardAccordion from "../../components/word-bank/word-list/details/WordAccordionItem";
import { useState } from "react";
import ModalWrapper from "../../components/common/ModalWrapper";
import ModalControlButtons from "../../components/common/modal/ModalControlButtons";
import Button from "../../components/common/form/Button";
import PrimaryTextInput from "../../components/common/form/PrimaryTextInput";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addWord } from "./WordList.service";
import useNotifications from "../../hooks/useNotifications";
import { generateErrorResponseMessage } from "../../utils/httpUtils";
import { isEmptyObj } from "../../components/utils";
import { useAtom } from "jotai";
import { wordListReducerAtom } from "./atoms";

interface WordListDetailsScreenProps {
  route: any;
}


const WordListDetailsScreen = ({ route }: WordListDetailsScreenProps) => {
  const selectedList = route.params.list as TWordList;
  const [, dispatch] = useAtom(wordListReducerAtom);
  const [isAddWordModalVisible, setIsAddWordModalVisible] = useState(false)
  const { add: addNotification } = useNotifications()
  const methods = useForm({
    defaultValues: {
      newWord: "",
    },
    mode: "onChange"
  })

  const { mutate: addNewWord, isPending: isAddingWord } = useMutation({
    mutationKey: ["addNewWord"],
    mutationFn: (word: string) => addWord({
      listId: selectedList.listId,
      word
    }),
    onSuccess: () => {
      dispatch({
        type: "addWord",
        payload: {
          targetListId: selectedList.listId,
          word: methods.getValues().newWord
        }
      })
      methods.reset()
    },
    onError: (error) => {
      addNotification({
        body: generateErrorResponseMessage(error, "Something went wrong while adding the word to the word list."),
        type: "error"
      })
    }
  })

  const onSubmit = (data: any) => {
    if (!isEmptyObj(methods.formState.errors)) {
      return;
    }

    addNewWord(data.newWord)
  }

  const onError = (error: any) => {
    addNotification({
      body: generateErrorResponseMessage(error, "Something went wrong while adding the word to the word list."),
      type: "error"
    })
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={selectedList.words}
        renderItem={({ item }) => <WordCardAccordion item={item} />}
        contentContainerStyle={{
          justifyContent: "center",
        }}
      />
      <FloatingButton handlePress={() => {setIsAddWordModalVisible(true)}} />
      <ModalWrapper
        onRequestClose={() => setIsAddWordModalVisible(false)}
        visible={isAddWordModalVisible}
      title="Add new word"
      > 
        <View style={styles.modalContents}>
          <FormProvider {...methods}>
            <PrimaryTextInput
              label="New word"
              name="newWord"
              defaultValue=""
              rules={{ required: true}}
              placeholder="Apple"
              />   
              <Button 
                type="primary"
                loading={isAddingWord} 
                onPress={methods.handleSubmit(onSubmit, onError)}
              >
                ADD
              </Button>
          </FormProvider>
        </View>
      </ModalWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContents: {
    rowGap: 20
  }
});

export default WordListDetailsScreen;
