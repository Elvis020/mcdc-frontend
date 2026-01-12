# Component Examples - Green Theme Implementation

## Quick Copy-Paste Examples

This guide provides ready-to-use code snippets for implementing the green theme in new components.

---

## Buttons

### Primary Button (Green)
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-shadow">
  Create Certificate
</Button>
```

### Secondary Button (Light Green)
```tsx
<Button variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Save Draft
</Button>
```

### Outline Button (Green Border)
```tsx
<Button
  variant="outline"
  className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-colors"
>
  View Details
</Button>
```

### Large Action Button with Icon
```tsx
<Button asChild className="w-full justify-start h-auto py-4 shadow-sm hover:shadow-md transition-shadow">
  <Link href="/dashboard/certificates/new" className="flex items-center space-x-3">
    <div className="flex items-center justify-center w-10 h-10 bg-primary-foreground/20 rounded-lg">
      <FilePlus className="w-5 h-5" />
    </div>
    <div className="flex-1 text-left">
      <p className="font-semibold">Create New Certificate</p>
      <p className="text-xs opacity-90">Start a new death certificate</p>
    </div>
  </Link>
</Button>
```

---

## Cards

### Basic Card
```tsx
<Card className="border-border shadow-sm">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Card with Green Accent
```tsx
<Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12" />
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">Title</CardTitle>
      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-primary" />
      </div>
    </div>
    <CardDescription className="text-xs">Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-4xl font-bold text-primary mb-1">42</p>
    <p className="text-xs text-primary/70 font-medium">Successfully filed</p>
  </CardContent>
</Card>
```

### Stat Card (Generic Pattern)
```tsx
<Card className="relative overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
  {/* Decorative blur */}
  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />

  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        Stat Name
      </CardTitle>
      <div className="flex items-center justify-center w-10 h-10 bg-primary/5 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <CardDescription className="text-xs">Subtitle</CardDescription>
  </CardHeader>

  <CardContent>
    <p className="text-4xl font-bold text-foreground mb-1">{count}</p>
    <p className="text-xs text-muted-foreground">Additional info</p>
  </CardContent>
</Card>
```

### Info Card with Green Border
```tsx
<Card className="border-primary/20 bg-primary/5">
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <AlertCircle className="w-5 h-5 text-primary" />
      <span>Information</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-foreground">Your information here</p>
  </CardContent>
</Card>
```

---

## Status Badges

### Active Status Badge
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
  Active
</span>
```

### Success Badge
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
  Completed
</span>
```

### Warning Badge
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/20 text-warning">
  Pending
</span>
```

### Error Badge
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
  Failed
</span>
```

---

## Banners & Headers

### Welcome Banner with Gradient
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 p-8">
  {/* Decorative blur */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

  <div className="relative">
    <div className="flex items-center space-x-3 mb-3">
      <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-lg">
        <Activity className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, Dr. {name}
        </h2>
      </div>
    </div>
    <div className="flex flex-col space-y-1 mt-4">
      <p className="text-sm font-medium text-foreground/80">
        Medical & Dental Council PIN: <span className="font-mono text-primary font-semibold">{pin}</span>
      </p>
    </div>
  </div>
</div>
```

### Status Bar
```tsx
<div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
  <div className="container mx-auto px-4 lg:px-6 py-2">
    <div className="flex items-center justify-center space-x-2 text-sm">
      <ShieldCheck className="w-4 h-4 text-primary" />
      <span className="text-foreground font-medium">Verified Medical Practitioner</span>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
        Active
      </span>
    </div>
  </div>
</div>
```

---

## Icons with Backgrounds

### Primary Icon (Green Background)
```tsx
<div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-sm">
  <FileText className="w-6 h-6 text-primary-foreground" />
</div>
```

### Light Icon (Light Green Background)
```tsx
<div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
  <Icon className="w-5 h-5 text-primary" />
</div>
```

### Avatar-Style Icon
```tsx
<div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
  <User className="w-4 h-4 text-primary" />
</div>
```

---

## Form Elements

### Label
```tsx
<Label htmlFor="field" className="text-sm font-medium text-foreground">
  Field Label
</Label>
```

### Input with Green Focus
```tsx
<Input
  id="field"
  type="text"
  placeholder="Enter value"
  className="h-11 border-border focus:border-primary focus:ring-primary"
/>
```

### Select with Green Focus
```tsx
<Select>
  <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## Alerts & Notifications

### Success Alert
```tsx
<Alert className="border-success/50 bg-success/10">
  <CheckCircle2 className="h-4 w-4 text-success" />
  <AlertTitle className="text-success">Success</AlertTitle>
  <AlertDescription className="text-success/80">
    Your action was completed successfully.
  </AlertDescription>
</Alert>
```

### Info Alert
```tsx
<Alert className="border-primary/50 bg-primary/10">
  <AlertCircle className="h-4 w-4 text-primary" />
  <AlertTitle className="text-primary">Information</AlertTitle>
  <AlertDescription className="text-primary/80">
    Here is some information for you.
  </AlertDescription>
</Alert>
```

### Warning Alert
```tsx
<Alert className="border-warning/50 bg-warning/10">
  <AlertTriangle className="h-4 w-4 text-warning" />
  <AlertTitle className="text-warning">Warning</AlertTitle>
  <AlertDescription className="text-warning/80">
    Please review this warning.
  </AlertDescription>
</Alert>
```

### Error Alert
```tsx
<Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
  <AlertDescription className="text-sm">
    An error occurred. Please try again.
  </AlertDescription>
</Alert>
```

---

## Navigation

### Nav Link (Header)
```tsx
<Link
  href="/dashboard"
  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
>
  <LayoutDashboard className="w-4 h-4" />
  <span>Dashboard</span>
</Link>
```

### Nav Link (Active State)
```tsx
<Link
  href="/dashboard"
  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20"
>
  <LayoutDashboard className="w-4 h-4" />
  <span>Dashboard</span>
</Link>
```

---

## Loading States

### Skeleton with Green Tint
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-primary/10 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-primary/10 rounded w-1/2"></div>
</div>
```

### Spinner
```tsx
<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
</div>
```

### Loading Button
```tsx
<Button disabled className="bg-primary/50">
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

---

## Tables

### Table Header
```tsx
<TableHead className="bg-muted/50 text-foreground font-semibold">
  Column Name
</TableHead>
```

### Table Row with Hover
```tsx
<TableRow className="hover:bg-primary/5 transition-colors">
  <TableCell>{data}</TableCell>
</TableRow>
```

---

## Empty States

### Empty State Card
```tsx
<Card className="border-border shadow-sm">
  <CardContent className="flex flex-col items-center justify-center py-12">
    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
      <FileText className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">No certificates yet</h3>
    <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
      Get started by creating your first death certificate
    </p>
    <Button asChild>
      <Link href="/dashboard/certificates/new">
        <FilePlus className="mr-2 h-4 w-4" />
        Create Certificate
      </Link>
    </Button>
  </CardContent>
</Card>
```

---

## Modals & Dialogs

### Dialog with Green Accent
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="border-border">
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <span>Dialog Title</span>
      </DialogTitle>
      <DialogDescription>
        Dialog description text here
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Dividers

### Simple Divider
```tsx
<div className="border-t border-border" />
```

### Divider with Text
```tsx
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t border-border" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-card px-2 text-muted-foreground">Or</span>
  </div>
</div>
```

---

## Status Indicators

### Pulsing Dot (Active)
```tsx
<div className="flex items-center space-x-2 text-xs text-muted-foreground">
  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
  <span>All systems operational</span>
</div>
```

### Status Dot (Static)
```tsx
<div className="flex items-center space-x-2">
  <div className="w-2 h-2 bg-primary rounded-full" />
  <span className="text-sm">Active</span>
</div>
```

---

## Lists

### Feature List Item
```tsx
<div className="flex items-start space-x-4">
  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg shrink-0">
    <CheckCircle2 className="w-5 h-5 text-primary" />
  </div>
  <div>
    <h3 className="font-semibold text-foreground mb-1">Feature Title</h3>
    <p className="text-sm text-muted-foreground">
      Feature description text goes here
    </p>
  </div>
</div>
```

---

## Quick Tips

### Color Opacity Quick Reference
```tsx
/5   = 5%  opacity (very subtle)
/10  = 10% opacity (subtle)
/20  = 20% opacity (light)
/30  = 30% opacity (visible)
/50  = 50% opacity (medium)
/80  = 80% opacity (strong)
/90  = 90% opacity (very strong)
```

### Common Patterns
```tsx
// Hover with shadow
hover:shadow-lg transition-shadow

// Hover with color
hover:bg-primary/5 transition-colors

// Focus ring (accessibility)
focus:ring-2 focus:ring-primary focus:ring-offset-2

// Card with accent
border-primary/20 bg-primary/5

// Icon container
w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center

// Status badge
px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary
```

---

## Copy-Paste Grid Layouts

### Three Column Stats
```tsx
<div className="grid gap-6 md:grid-cols-3">
  {/* Cards here */}
</div>
```

### Two Column Layout
```tsx
<div className="grid gap-6 lg:grid-cols-2">
  {/* Cards here */}
</div>
```

### Responsive Four Column
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Cards here */}
</div>
```

---

## Usage Tips

1. **Always use semantic color names**: `bg-primary`, `text-primary`, not hardcoded values
2. **Add transitions**: Most interactive elements should have `transition-colors` or `transition-shadow`
3. **Use opacity modifiers**: `/10`, `/20`, `/50` for transparent variants
4. **Include hover states**: All interactive elements need hover feedback
5. **Add focus rings**: Critical for accessibility (keyboard navigation)
6. **Use icons consistently**: Lucide React icons throughout
7. **Maintain spacing**: Use space-y-* and space-x-* for consistency
8. **Border radius**: Use `rounded-lg` (default), `rounded-xl` (larger), `rounded-full` (circular)

---

## Need More Examples?

Check the actual implementation files:
- `/app/(dashboard)/layout.tsx` - Header and navigation
- `/app/(dashboard)/dashboard/page.tsx` - Dashboard components
- `/app/(auth)/layout.tsx` - Auth layout patterns
- `/app/(auth)/login/page.tsx` - Form styling
