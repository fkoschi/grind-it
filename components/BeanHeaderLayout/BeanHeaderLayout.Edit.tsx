import { Alert, DeleteOutlinedIcon } from "@/components/ui";
import { beanTable } from "@/db/schema";
import { useDatabase } from "@/provider/DatabaseProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { eq } from "drizzle-orm";
import { Button, View, Text } from "tamagui";
import { useBeansData } from "@/hooks/useBensData";
import { useTranslation } from "react-i18next";

export const BeanHeaderLayoutEdit = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { db } = useDatabase();
  const { id: beanId } = useLocalSearchParams();

  const beansData = useBeansData();

  const handleDeleteBeanPress = async () => {
    await db.delete(beanTable).where(eq(beanTable.id, Number(beanId)));
    router.replace("/");
  };

  return (
    <View flex={1}>
      <View position="absolute" right={32} top={44}>
        <Alert
          title={t("editBean.delete.title")}
          cancelTitle={t("common.cancel")}
          actionTitle={t("common.delete")}
          description={t("editBean.delete.description")}
          onActionPress={handleDeleteBeanPress}
          alertTrigger={
            <Button flex={1} bgC={"rgba(255, 255, 255, 0.2)"} borderRadius="$radius.9" p="$3">
              <DeleteOutlinedIcon size={16} color="#CD5B5B" />
            </Button>
          }
        />
      </View>
      <View flex={1} justifyContent="flex-end" alignItems="center" mb="$6">
        <Text fontSize={48} fontFamily="$sodabery">
          {beansData?.name}
        </Text>
      </View>
    </View>
  );
};
