Design all new UI components using the **Composition Pattern** — a root container with sub-components for each functional/visual part, exposed as a single namespace object. Never build monolithic components controlled by many props.

## How to implement

1. **Root component** — accepts minimal props (layout/style) and renders `children`:

```tsx
const SomethingRoot: FC<PropsWithChildren<ViewProps>> = ({ children, ...props }) => (
  <View {...props}>{children}</View>
);
```

2. **Sub-components** — one per functional part, each with single responsibility and its own props:

```tsx
const SomethingIcon: FC<IconProps> = (props) => <Icon {...props} />;
const SomethingText: FC<TextProps> = ({ children, ...props }) => <Text {...props}>{children}</Text>;
```

3. **Bundle on a namespace export**:

```tsx
export const Something = {
  Root: SomethingRoot,
  Icon: SomethingIcon,
  Text: SomethingText,
};
```

## Rules

- Favor `children` for layout instead of toggling variants through boolean props.
- Avoid prop drilling — expose sub-components rather than passing props through many layers.
- Use React Context or custom hooks when multiple sub-components share state.
- Use this pattern when a component has multiple logical parts (icons, text, labels, controls) or when a component API is growing many props.
