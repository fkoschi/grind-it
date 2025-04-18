import { Pressable } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "tamagui/linear-gradient";
import {
  useLocalSearchParams,
  useRouteInfo,
  useRouter,
} from "expo-router/build/hooks";
import { PATH_NAME as EDIT_BEAN_PATH_NAME } from "../edit/[id]";
import { PATH_NAME as DETAILS_BEAN_PATH_NAME } from "../details/[id]";
import { PATH_NAME as EDIT_DEGREE_PATH_NAME } from "../edit/degree/[id]";

import { BeanHeaderLayoutEdit as EditBean } from "./BeanHeaderLayout.Edit";
import { BeanHeaderLayoutDetails as Details } from "./BeanHeaderLayout.Details";
import { BeanHeaderLayoutAdd as Add } from "./BeanHeaderLayout.Add";
import { BeanHeaderLayoutEditDegree as EditDegree } from "./BeanHeaderLayout.EditDegree";
import React from "react";
import { useBeansData } from "@/hooks/useBensData";

const BeanHeaderLayout = () => {
  const router = useRouter();
  const beansData = useBeansData();
  const { id: beanId } = useLocalSearchParams();
  const { pathname: routerPathName } = useRouteInfo();

  const height = useSharedValue(240);
  const isEditBeanRoute = routerPathName === `${EDIT_BEAN_PATH_NAME}/${beanId}`;
  const isDetailsRoute =
    routerPathName === `${DETAILS_BEAN_PATH_NAME}/${beanId}`;
  const isEditDegreeRoute = routerPathName.includes(EDIT_DEGREE_PATH_NAME);
  const isAddRoute = routerPathName.includes("add");

  return (
    <Animated.View style={{ height, flex: 0 }}>
      <LinearGradient
        flex={1}
        colors={["#FFDAAB", "#E89E3F"]}
        borderBottomLeftRadius="$12"
        borderBottomRightRadius="$12"
        start={[0, 1]}
        end={[0, 0]}
      >
        <Pressable
          style={{ position: "sticky", top: 80, left: 32 }}
          onPress={() => router.back()}
        >
          <Image
            source={require("@/assets/icons/back.png")}
            style={{ width: 24, height: 24 }}
          />
        </Pressable>
        {isAddRoute && <Add />}
        {isDetailsRoute && beansData && (
          <Details isFavorite={beansData.isFavorit} />
        )}
        {isEditDegreeRoute && <EditDegree />}
        {isEditBeanRoute && <EditBean />}
      </LinearGradient>
    </Animated.View>
  );
};

export default BeanHeaderLayout;
