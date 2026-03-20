<img alt="React Native Typescript Boilerplate" src="../assets/logo.png" width="1050"/>

# 🍾 Components

## Styles

- **TextWrapper** over default Text component
- Colors
- Fonts
- Theme
- Font Size

## Imports

Predefined **`h`** tags are usable with TextWrapper

```jsx
import Text from "@shared-components/text-wrapper/Text";

// ? Advanced Usage Example
<Text h3 bold right color="#913400" numberOfLines={1} style={{ margin: 16 }}>
  Heading 3 Bold Right Sided Custom Text
</Text>;
```

```jsx
import colors from "@colors";

<Text h1 color={colors.light.primary}>
  Heading 1 with custom color from theme
</Text>;
```

```jsx
import fonts from "@fonts";

<Text h5 fontFamily={fonts.helvetica.regular}>
  Heading 1 with custom font usage
</Text>;
```

```jsx
import fontSize from "@font-size";
```

```jsx
import theme from "@theme";
```

if you want to call them all at once

```js
import { theme, fonts, colors, spacing, fontSize } from "@shared-styles/index";
```
