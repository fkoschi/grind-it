import { Slot, useNavigation } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import { View } from "tamagui";
import React, { useEffect } from "react";

import EditBean from "./EditBean";
import BeanHeaderLayout from "./layout/BeanHeaderLayout";

const BeanLayout = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <EditBean>
      <View flex={1}>
        <BeanHeaderLayout />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={16}
        >
          <Slot />
        </KeyboardAvoidingView>
      </View>
    </EditBean>
  );
};

export default BeanLayout;
