---
trigger: always_on
---

# React Component Composition Rule

## Purpose

This guideline describes how to design React UI components using the **Composition Pattern** instead of relying on a large number of props.  
Following this pattern improves **reusability**, **maintainability**, **readability**, and **scalability** of components in your codebase.  [oai_citation:1‡DEV Community](https://dev.to/ricardolmsilva/composition-pattern-in-react-28mj?utm_source=chatgpt.com)

---

## What the Composition Pattern Solves

Traditional component implementations often grow many props as requirements change. Later, buttons, input fields, or other UI elements accumulate dozens of props for styles, icons, states, etc., which:

- increases complexity and prop drilling,
- makes components harder to understand,
- leads to maintenance challenges as requirements evolve.  [oai_citation:2‡DEV Community](https://dev.to/ricardolmsilva/composition-pattern-in-react-28mj?utm_source=chatgpt.com)

The Composition Pattern prevents this by **breaking a component into smaller building blocks** that are composed together in usage rather than configured through props.  [oai_citation:3‡DEV Community](https://dev.to/ricardolmsilva/composition-pattern-in-react-28mj?utm_source=chatgpt.com)

---

## Composition Rule (General)

> **Design all new UI components as composable pieces, with a root container and sub-components representing functional or visual sub parts. Provide a clear, declarative API by exposing those sub-components instead of supporting many props on one monolithic component.**  [oai_citation:4‡DEV Community](https://dev.to/ricardolmsilva/composition-pattern-in-react-28mj?utm_source=chatgpt.com)

---

## Implementation Pattern

### 1. **Create a Root Component**

The root acts as the main container and accepts minimal configuration props (e.g., layout styles). It should only define structure and minimal behavior:

```tsx
interface ComponentRootProps extends React.ComponentProps<'div'> {
  className?: string;
}

export const SomethingRoot: React.FC<ComponentRootProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={className} {...props}>
    {children}
  </div>
);

### 2. Define Sub-components for functional parts

```
export const SomethingIcon: React.FC<React.ComponentProps<typeof Icon>> = props => (
  <Icon {...props} />
);

export const SomethingText: React.FC<React.ComponentProps<'span'>> = ({
  children,
  ...props
}) => <span {...props}>{children}</span>;

```
Each sub-component should have single responsibility and its own props so it is reusable independently.



### 3. Bundle Sub-Components on an Export Object

Provide all pieces together on a single namespace for convenient usage:

```
export const Something = {
  Root: SomethingRoot,
  Icon: SomethingIcon,
  Text: SomethingText,
};
```

Best Practices

Follow these additional principles when composing components:

✔ Keep Components Small and Focused

Each component should have a single responsibility, and combined by composition to build larger UIs.  ￼

✔ Favor “Children” for Layout

Use the children prop to place any number of sub-components into the root structure instead of toggling variants through boolean props.  ￼

✔ Avoid Prop Drilling

Expose specific sub-components rather than passing props deep through many layers.  ￼

✔ Use Context or Hooks for Shared Logic

If multiple sub-components share state or behavior, use React Context or custom hooks to share logic without coupling the API.  ￼

⸻

When To Use Composition

Use this pattern when:
	•	A component has multiple logical parts (icons, text, labels, controls).
	•	Component APIs grow many props for internal variations.
	•	You want clear control over layout and behavior at the usage site.  ￼

⸻

Summary

By designing components as small pieces that are composed instead of controlled via many props:
	•	APIs stay simple and explicit,
	•	code becomes more maintainable,
	•	adding new variants doesn’t increase internal complexity,
	•	structure is clearer to consumers of components.  ￼
