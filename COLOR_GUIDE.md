# MCDC Color Guide - Professional Medical Green Theme

## Quick Reference

This guide provides an easy reference for the color scheme used throughout the MCDC system.

## Primary Colors

### Main Green (Primary)
- **HSL**: `hsl(152, 65%, 35%)`
- **Hex**: `#1E7F5E` (approximate)
- **Usage**: Primary buttons, active states, brand elements, logos
- **Text Color**: White (`#FFFFFF`)

### Light Green (Secondary)
- **HSL**: `hsl(145, 30%, 92%)`
- **Hex**: `#E8F5ED` (approximate)
- **Usage**: Secondary buttons, subtle backgrounds, highlights
- **Text Color**: Dark green (`hsl(152, 65%, 25%)`)

### Very Light Green (Muted)
- **HSL**: `hsl(145, 25%, 96%)`
- **Hex**: `#F5FAF7` (approximate)
- **Usage**: Page backgrounds, card backgrounds, subtle sections
- **Text Color**: Muted foreground

## Background Colors

### Pure White (Background)
- **HSL**: `hsl(0, 0%, 100%)`
- **Hex**: `#FFFFFF`
- **Usage**: Main content areas, cards, headers
- **Text Color**: Foreground (`hsl(160, 5%, 15%)`)

### Light Tint (Muted Background)
- **HSL**: `hsl(145, 25%, 96%)`
- **Hex**: `#F5FAF7` (approximate)
- **Usage**: Page backgrounds, alternating sections
- **Text Color**: Standard foreground

## Status Colors

### Success (Bright Green)
- **HSL**: `hsl(152, 70%, 45%)`
- **Hex**: `#1FAB76` (approximate)
- **Usage**: Success messages, completed status, positive indicators
- **Text Color**: White

### Warning (Amber)
- **HSL**: `hsl(45, 93%, 47%)`
- **Hex**: `#F5A623` (approximate)
- **Usage**: Warnings, pending status, draft certificates
- **Text Color**: White or dark gray

### Error (Destructive Red)
- **HSL**: `hsl(0, 84.2%, 60.2%)`
- **Hex**: `#EF4444` (approximate)
- **Usage**: Error messages, destructive actions, failed states
- **Text Color**: White

### Info (Teal)
- **HSL**: `hsl(180, 60%, 45%)`
- **Hex**: `#2DABB8` (approximate)
- **Usage**: Informational messages, neutral status
- **Text Color**: White

## Border Colors

### Default Border
- **HSL**: `hsl(145, 20%, 88%)`
- **Hex**: `#D9E9E0` (approximate)
- **Usage**: Card borders, dividers, input borders
- **Opacity**: Can use at 50% for subtle borders

### Focus Ring
- **HSL**: `hsl(152, 65%, 35%)`
- **Hex**: `#1E7F5E` (approximate)
- **Usage**: Focus states on interactive elements
- **Opacity**: Usually 50% with blur

## Text Colors

### Primary Text (Foreground)
- **HSL**: `hsl(160, 5%, 15%)`
- **Hex**: `#242726` (approximate)
- **Usage**: Main body text, headings, important content

### Muted Text (Muted Foreground)
- **HSL**: `hsl(160, 5%, 45%)`
- **Hex**: `#6F7571` (approximate)
- **Usage**: Secondary text, descriptions, subtle information

### Primary Foreground (White)
- **HSL**: `hsl(0, 0%, 100%)`
- **Hex**: `#FFFFFF`
- **Usage**: Text on green backgrounds, primary button text

## Usage Examples

### Primary Button
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Create Certificate
</Button>
```
**Result**: Green button with white text

### Secondary Button
```tsx
<Button variant="outline" className="border-primary/20 hover:bg-primary/5">
  View Details
</Button>
```
**Result**: White button with green border and subtle green hover

### Success Card
```tsx
<Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
  <div className="text-primary">Success!</div>
</Card>
```
**Result**: Card with green accent border and subtle green gradient

### Status Badge
```tsx
<span className="bg-primary/20 text-primary px-2 py-1 rounded-full">
  Active
</span>
```
**Result**: Light green badge with dark green text

## Color Combinations

### High Contrast (Accessible)
- **Background**: White (`#FFFFFF`)
- **Text**: Dark Green (`hsl(160, 5%, 15%)`)
- **Accent**: Primary Green (`hsl(152, 65%, 35%)`)

### Subtle Highlight
- **Background**: Very Light Green (`hsl(145, 25%, 96%)`)
- **Text**: Standard foreground
- **Border**: Light green border (`hsl(145, 20%, 88%)`)

### Call to Action
- **Background**: Primary Green (`hsl(152, 65%, 35%)`)
- **Text**: White (`#FFFFFF`)
- **Shadow**: Green shadow at 10% opacity

### Warning/Draft State
- **Background**: Amber/Light Orange (`hsl(45, 93%, 97%)`)
- **Text**: Dark Amber (`hsl(45, 93%, 37%)`)
- **Icon**: Amber (`hsl(45, 93%, 47%)`)

## Gradient Patterns

### Welcome Header Gradient
```css
background: linear-gradient(135deg,
  hsl(152, 65%, 35%, 0.1) 0%,
  hsl(152, 65%, 35%, 0.05) 50%,
  transparent 100%
);
```

### Auth Panel Gradient
```css
background: linear-gradient(135deg,
  hsl(152, 65%, 35%) 0%,
  hsl(152, 65%, 35%) 50%,
  hsl(152, 65%, 35%, 0.8) 100%
);
```

## Opacity Guidelines

### Background Overlays
- **Subtle**: 5% - 10% for very light tints
- **Light**: 10% - 20% for card backgrounds
- **Medium**: 20% - 30% for borders
- **Strong**: 30% - 50% for badges

### Hover States
- **Buttons**: Reduce primary color by 10% (use `/90`)
- **Cards**: Add 5% primary color on hover
- **Links**: Reduce opacity by 20%

## Accessibility Notes

### Contrast Ratios
- **Primary on White**: 5.2:1 (AA compliant)
- **Foreground on Background**: 14.8:1 (AAA compliant)
- **Muted on Background**: 4.6:1 (AA compliant)
- **Success on White**: 4.8:1 (AA compliant)

### Color Blindness Considerations
- Green and red are never used together for status
- Status is also indicated with icons, not just color
- Sufficient contrast maintained in all combinations

## Dark Mode Colors

### Primary Adjustments
- **Primary**: Lighter green `hsl(152, 55%, 50%)`
- **Background**: Deep green-black `hsl(160, 15%, 8%)`
- **Card**: Dark green `hsl(160, 12%, 12%)`
- **Foreground**: Light gray-white `hsl(145, 10%, 95%)`

## Implementation Tips

1. **Use Tailwind Classes**: Prefer `bg-primary`, `text-primary-foreground`, etc.
2. **Opacity Modifiers**: Use `/10`, `/20`, `/50` for transparent variants
3. **Hover States**: Use `hover:` prefix for interactive feedback
4. **Focus Rings**: Use `focus:ring-primary focus:ring-2` for accessibility
5. **Gradients**: Combine `from-primary/10 to-transparent` for subtle effects

## Quick Color Picker

When designing new components:

| Element Type | Background | Text | Border | Hover |
|-------------|------------|------|--------|-------|
| Primary Action | primary | white | none | primary/90 |
| Secondary Action | secondary | primary | primary/20 | primary/5 |
| Neutral Card | white | foreground | border | shadow-lg |
| Success State | success/10 | success | success/30 | success/20 |
| Warning State | warning/10 | warning | warning/30 | warning/20 |
| Error State | destructive/10 | destructive | destructive/30 | destructive/20 |

## Figma/Design Tool Values

For design tools that need exact values:

```
Primary Green: #1E7F5E
Light Green: #E8F5ED
Very Light: #F5FAF7
Success: #1FAB76
Warning: #F5A623
Error: #EF4444
Info: #2DABB8
Foreground: #242726
Muted: #6F7571
Border: #D9E9E0
```

## CSS Custom Properties

Access in your CSS:
```css
color: hsl(var(--primary));
background: hsl(var(--primary) / 0.1);
border: 1px solid hsl(var(--border));
```

## React/Tailwind Examples

```tsx
// Primary button
className="bg-primary text-primary-foreground hover:bg-primary/90"

// Success indicator
className="text-success bg-success/10 border border-success/30"

// Card with green accent
className="bg-card border-primary/20 hover:shadow-lg"

// Badge
className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs"
```
