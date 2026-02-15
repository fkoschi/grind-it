## 1. Setup i18n infrastructure

- [x] 1.1 Install dependencies: expo-localization, i18next, react-i18next
- [x] 1.2 Create `i18n.ts` config file with expo-localization locale detection and bundled resources
- [x] 1.3 Create `locales/de.json` with all German strings extracted from the codebase
- [x] 1.4 Create `locales/en.json` with English translations for all keys
- [x] 1.5 Import `@/i18n` in `app/_layout.tsx` to initialize i18n on app start

## 2. Replace hardcoded strings in app screens

- [x] 2.1 `app/index.tsx` — dashboard empty state strings
- [x] 2.2 `app/settings.tsx` — all labels, alert titles/messages, export/import strings
- [x] 2.3 `app/add-bean.tsx` — form labels (Rösterei, Geschmack, etc.)
- [x] 2.4 `app/bean/edit/[id].tsx` — form labels, shot types, bean type labels
- [x] 2.5 `app/chat.tsx` — initial chat message, title
- [x] 2.6 `app/taste/EditTastePage.tsx` — page title, empty state
- [x] 2.7 `app/roasteries/EditRoasteryPage.tsx` — page title, empty state

## 3. Replace hardcoded strings in components

- [x] 3.1 `components/Dashboard/DashboardNoData.tsx` — search no results text
- [x] 3.2 `components/BeanHeaderLayout/BeanHeaderLayout.Add.tsx` — header title/subtitle
- [x] 3.3 `components/BeanHeaderLayout/BeanHeaderLayout.Edit.tsx` — delete alert strings
- [x] 3.4 `components/BeanHeaderLayout/BeanHeaderLayout.EditDegree.tsx` — header subtitle
- [x] 3.5 `components/BottomSheet/Frames/Bean/Add/AddBeanTasteFrame.tsx` — done/cancel buttons
- [x] 3.6 `components/BottomSheet/Frames/Bean/Add/components/AddBeanTasteFrameSelection.tsx` — selection label
- [x] 3.7 `components/BottomSheet/Frames/Bean/Add/components/AddBeanTasteFrameSuggestions.tsx` — suggestions label
- [x] 3.8 `components/BottomSheet/Frames/Bean/Edit/EditBeanTasteFrame.tsx` — selection/suggestions/buttons
- [x] 3.9 `components/BottomSheet/Frames/Bean/Edit/EditAromaFrame.tsx` — aroma labels, title, buttons
- [x] 3.10 `components/BottomSheet/Frames/Bean/Info/AromaInfoFrame.tsx` — all aroma descriptions, title, close button
- [x] 3.11 `components/BottomSheet/Frames/Roastery/AddRoasteryFrame.tsx` — title, validation message
- [x] 3.12 `components/BottomSheet/Frames/Taste/AddTasteFrame.tsx` — title, description, validation, buttons
- [x] 3.13 `components/ui/Pages/DetailsPage/DetailsPage.tsx` — tab labels (Infos, Aroma Rad)
- [x] 3.14 `components/ui/Pages/DetailsPage/components/DetailsPage.InfoTab.tsx` — labels
- [x] 3.15 `components/ui/Pages/DetailsPage/components/DetailsPage.DetailsTab.tsx` — aroma labels, empty state
- [x] 3.16 `components/ui/Search/Search.tsx` — search placeholder
- [x] 3.17 `components/ui/ProFeatureOverlay/ProFeatureOverlay.tsx` — pro overlay text
- [x] 3.18 `components/Chat/ChatInput.tsx` — input placeholder

## 4. Verification

- [x] 4.1 Verify all translation keys exist in both en.json and de.json
- [x] 4.2 Run lint and format checks
