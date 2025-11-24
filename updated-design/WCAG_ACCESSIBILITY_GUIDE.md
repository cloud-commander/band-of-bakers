# WCAG 2.1 AA Accessibility Compliance Guide - Band of Bakers

## Overview

This guide outlines the comprehensive accessibility strategy for the Band of Bakers e-commerce platform. WCAG 2.1 Level AA compliance ensures the website is usable by everyone, including people with disabilities, using assistive technologies like screen readers, keyboard navigation, and voice control.

---

## WCAG 2.1 AA Compliance Features

### Introduction to WCAG

**WCAG (Web Content Accessibility Guidelines) Four Principles:**

1. **Perceivable** - Information is perceivable to users
2. **Operable** - Users can operate the interface
3. **Understandable** - Information and operation are understandable
4. **Robust** - Content works with assistive technologies

**Accessibility Level AA** is the standard recommended by most governments and organizations.

---

## Perceivable - Information Must Be Perceivable

### Color Contrast (WCAG AA)

**Requirements:**

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18pt+):** Minimum 3:1 contrast ratio
- **Graphical elements & UI components:** 3:1 ratio

**Implementation:**

- Test all text colors against backgrounds
- Use contrast checker tools (WebAIM, Contrast Ratio)
- Ensure sufficient contrast in interactive elements
- Don't rely on color alone to convey information

**Example:**

```
❌ Bad: Light gray text (#CCCCCC) on white (#FFFFFF) = 1.16:1 ratio
✅ Good: Dark gray text (#595959) on white (#FFFFFF) = 7:1 ratio
```

**Tools:**

- WebAIM Contrast Checker
- Contrast Ratio by Lea Verou
- Chrome DevTools Accessibility Audit
- WAVE Web Accessibility Evaluation Tool

### Color Not Sole Means of Information

**Requirement:** Users shouldn't have to understand color to use the site.

**What This Means:**

- Status shouldn't be indicated by color alone
- Use text labels in addition to colors
- Use icons/patterns alongside colors
- Combine color with text or icons

**Examples:**

```
❌ Bad: Red badge = out of stock (color only)
✅ Good: Red badge + "Out of Stock" text

❌ Bad: Green highlight = required field (color only)
✅ Good: Green highlight + asterisk + "Required" label

❌ Bad: Blue border = focused input (color only)
✅ Good: Blue border + visible focus ring + outline
```

### Resizable Text & Zoom

**Requirements:**

- Content readable at 200% zoom
- No horizontal scrolling at 200% zoom
- Text can be resized without loss of functionality
- Responsive design adapts to all screen sizes

**Implementation:**

- Use relative font sizes (rem, em, %)
- Avoid fixed widths
- Test at 200% zoom regularly
- Ensure mobile responsiveness
- Support browser zoom

**Testing:**

```
1. Open site in browser
2. Press Ctrl++ (or Cmd++ on Mac) three times
3. Verify all text is readable
4. Check no horizontal scrolling needed
5. Verify functionality still works
```

### Text Spacing

**Adjustable Spacing:**

- Line height (leading): at least 1.5×
- Paragraph spacing: at least 2× font size
- Letter spacing: at least 0.12× font size
- Word spacing: at least 0.16× font size

**Implementation:**

- Use CSS properties for spacing
- Allow user customization via settings
- Test with adjusted spacing
- Ensure readability maintained

### Visual Indicators

**Clear Indicators for:**

- **Focus states:** Visible focus outline (not removed)
- **Hover states:** Clear visual change
- **Disabled states:** Obviously disabled appearance
- **Current page:** Clear highlighting in navigation
- **Error states:** Red outline + error message

**Implementation:**

```css
/* Focus indicator (never remove!) */
button:focus {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}

/* Hover state */
button:hover {
  background-color: #e0e0e0;
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Operable - Users Can Operate the Interface

### Keyboard Navigation (Critical!)

**Requirement:** All functionality must be available via keyboard.

**What Must Be Keyboard Accessible:**

- All links
- All buttons
- All form fields
- All menu items
- All interactive elements
- Modal dialogs
- Dropdown menus
- Carousels
- Tooltips

**Implementation:**

```html
<!-- Proper semantic HTML -->
<button>Click me</button>
<a href="/page">Link</a>
<input type="text" />

<!-- Avoid if possible -->
<div onclick="doSomething()" tabindex="0">Not a button</div>
```

**Tab Order:**

- Natural reading order (left to right, top to bottom)
- Logical sequence through form fields
- Skip links for main content
- Focus management through modals
- No keyboard traps

**Testing Keyboard Navigation:**

1. Unplug mouse
2. Press Tab to move forward
3. Shift+Tab to move backward
4. Enter/Space to activate
5. Arrow keys for menus/selects
6. Escape to close dialogs

### Skip Links

**Purpose:** Allow keyboard users to skip repetitive content.

**Implementation:**

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Later in page -->
<main id="main-content">
  <!-- Main content here -->
</main>
```

**Styling:**

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### No Keyboard Trap

**Requirement:** Users must be able to navigate away from any element using keyboard alone.

**Problematic Pattern:**

```
Focus enters modal → Tab through elements → Tab reaches "Close" button
User presses Tab → Focus goes back to first element (TRAP!)
```

**Correct Pattern:**

```
1. Focus enters modal
2. Tab through modal content
3. Tab reaches last element
4. Tab moves back to first element (circular)
5. Escape key closes modal
```

**Implementation:**

Use semantic HTML and libraries that handle focus management:

- Dialog/Modal components
- Dropdown menus
- Autocomplete inputs

### Focus Management

**When to Manage Focus:**

1. **Navigation:** Focus moves to main content
2. **Modal opens:** Focus trapped inside modal
3. **Page changes:** Focus returns to logical place
4. **Error:** Focus moves to error message

**JavaScript Example:**

```javascript
// When modal opens
function openModal() {
  modal.showModal();
  // Focus first input in modal
  modal.querySelector('input').focus();
}

// When modal closes
function closeModal() {
  modal.close();
  // Return focus to trigger button
  triggerButton.focus();
}
```

### Timing & Animation

**Requirements:**

- No auto-advancing carousels without pause control
- Auto-playing videos must have pause button
- No flashing content (more than 3 times/second)
- Animated content shouldn't be essential
- No time limits that can't be extended

**Implementation:**

- Always provide pause/play controls
- Test animations at 200% zoom
- Avoid rapid flashing
- Allow users to disable animations (prefers-reduced-motion)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Understandable - Information & Operation Are Understandable

### Language Identification

**Requirement:** Page language specified, language changes identified.

**Implementation:**

```html
<!-- Primary language -->
<html lang="en">
  <!-- Language change within page -->
  <p>The French word <span lang="fr">bonjour</span> means hello.</p>
</html>
```

### Page Purpose & Structure

**Requirements:**

- Clear, descriptive page title
- Main purpose obvious without reading entire page
- Clear headings and structure
- Logical reading order

**Page Titles:**

- Unique for each page
- Include context
- Brand name last
- Examples:
  ```
  Product Checkout - Band of Bakers
  Help & FAQ - Band of Bakers
  My Orders - Account - Band of Bakers
  ```

### Heading Hierarchy

**Requirements:**

- H1 per page (exactly one)
- Logical sequence (no skipping levels)
- Headings describe content
- Don't use headings for styling

**Correct Structure:**

```html
<h1>Products</h1>
<h2>Breads</h2>
<h3>Sourdough</h3>
<h3>Wheat</h3>
<h2>Pastries</h2>
<h3>Croissants</h3>
```

**Incorrect Structure:**

```html
<h1>Products</h1>
<h3>Breads</h3>
<!-- Skipped H2! -->
<h4>Sourdough</h4>
```

### Form Labels & Instructions

**Requirements:**

- Every input has associated label
- Instructions before input
- Required fields marked
- Error messages linked to fields

**HTML:**

```html
<!-- Good -->
<label for="email">Email *</label>
<input id="email" type="email" required aria-label="Email" />

<!-- Bad -->
<input type="email" placeholder="Enter email" />
```

### Error Identification

**Requirements:**

- Errors identified clearly (not color alone)
- Suggestions for correction provided
- User's data preserved after error
- Clear error messages

**Implementation:**

```html
<div role="alert" aria-live="assertive">
  <strong>Error:</strong> Email address is required.
  <a href="#email">Go to email field</a>
</div>

<input id="email" type="email" aria-describedby="email-error" />
```

### Consistent Navigation

**Requirement:** Navigation appears in same place/order across pages.

**Implementation:**

- Same header/footer on all pages
- Same menu structure
- Same button styles
- Consistent terminology

---

## Robust - Content Works With Assistive Technologies

### Valid HTML & ARIA

**HTML:**

- Semantic HTML (button, link, nav, main, etc.)
- Valid syntax (validated by W3C)
- Proper nesting of elements
- No deprecated attributes

**ARIA (Accessible Rich Internet Applications):**

- Supplements semantic HTML (doesn't replace it)
- Defines roles, states, properties
- Used for dynamic content
- Tested with screen readers

**Examples:**

```html
<!-- Good -->
<nav role="navigation">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<!-- Also good (nav is implicit) -->
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<!-- Avoid -->
<div role="navigation">
  <span onclick="goHome()">Home</span>
</div>
```

### Alt Text for Images

**Requirements:**

- Decorative images: empty alt=""
- Content images: descriptive alt text
- Images in links: describe destination
- Complex images: extended description

**Examples:**

```html
<!-- Decorative -->
<img src="divider.png" alt="" />

<!-- Product image -->
<img src="sourdough.jpg" alt="Artisan sourdough loaf with scoring marks" />

<!-- Image link -->
<a href="/products">
  <img src="bread.jpg" alt="Browse all breads" />
</a>

<!-- Chart: provide data elsewhere -->
<img src="sales-chart.png" alt="Monthly sales trends" />
<p>Sales increased 25% from Jan to Feb...</p>
```

### Icons & Buttons

**Icon Buttons Need Labels:**

```html
<!-- Good -->
<button aria-label="Close">✕</button>
<button aria-label="Search">🔍</button>

<!-- Also good -->
<button>Close ✕</button>

<!-- Bad -->
<button>✕</button>
```

### Screen Reader Text

**Hidden Text for Screen Readers:**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Usage:**

```html
<button>
  <span aria-hidden="true">×</span>
  <span class="sr-only">Close dialog</span>
</button>
```

### Form Accessibility

**Good Form Implementation:**

```html
<fieldset>
  <legend>Delivery Method *</legend>

  <div>
    <input
      type="radio"
      id="collection"
      name="delivery"
      value="collection"
      required
    />
    <label for="collection">
      Collection <span class="sr-only">(pickup at location)</span>
    </label>
  </div>

  <div>
    <input type="radio" id="delivery" name="delivery" value="delivery" />
    <label for="delivery">
      Delivery <span class="sr-only">(shipped to address)</span>
    </label>
  </div>
</fieldset>
```

### Tables

**Accessible Tables:**

```html
<table>
  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Price</th>
      <th scope="col">Availability</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Sourdough Bread</td>
      <td>£4.50</td>
      <td>Available</td>
    </tr>
  </tbody>
</table>
```

### Mobile Accessibility

**Touch Targets:**

- Minimum 44×44 pixel touch targets
- Adequate spacing between targets
- No accidental activation
- Target size visible on mobile

**Responsive Design:**

- Works at all zoom levels
- Flexible layouts
- Mobile-first approach
- Touch-friendly controls

---

## Assistive Technology Testing

### Screen Readers (Required Testing)

**Windows:**

- NVDA (free, open source)
- JAWS (paid, industry standard)

**Mac:**

- VoiceOver (built-in)

**iOS:**

- VoiceOver (built-in)

**Android:**

- TalkBack (built-in)

**Browser Extensions:**

- WAVE (Firefox, Chrome)
- axe DevTools (Chrome, Firefox)

### Testing Procedure

1. **Basic Navigation**

   - Can users navigate with keyboard?
   - Is everything focusable?
   - Is focus visible?

2. **Screen Reader Testing**

   - Does page structure make sense?
   - Are images described?
   - Are form fields labeled?
   - Are buttons identifiable?

3. **Color & Contrast**

   - Is color contrast sufficient?
   - Does color convey info alone?

4. **Mobile**

   - Touch targets adequate?
   - Is responsive design working?
   - Is zoom working?

5. **Forms**
   - Are required fields marked?
   - Are errors clear?
   - Can validation be bypassed for testing?

---

## Implementation Checklist

### For All Pages

- [ ] Language specified (lang attribute)
- [ ] Descriptive page title
- [ ] H1 heading present (exactly one)
- [ ] Heading hierarchy logical (H1 → H2 → H3)
- [ ] Proper semantic HTML (button, link, nav, main)
- [ ] Color contrast ≥ 4.5:1 (normal text)
- [ ] Color contrast ≥ 3:1 (large text)
- [ ] Readable at 200% zoom
- [ ] Keyboard navigable (Tab through all functions)
- [ ] Focus indicators visible
- [ ] Skip link present
- [ ] No keyboard traps
- [ ] Consistent navigation
- [ ] Alt text for all images
- [ ] ARIA labels for icons/buttons

### For Forms

- [ ] Every input has associated label
- [ ] Required fields marked with asterisk AND text
- [ ] Error messages in alert role
- [ ] Error messages linked to fields
- [ ] Form instructions before inputs
- [ ] Proper fieldsets/legends for groups
- [ ] Auto-fill supported
- [ ] Validation errors don't lose data

### For Navigation

- [ ] Consistent menu structure
- [ ] Skip to main content link
- [ ] Current page highlighted
- [ ] Menu keyboard accessible
- [ ] Breadcrumb navigation available
- [ ] Logical tab order
- [ ] No menu traps

### For Interactive Content

- [ ] Carousels have pause button
- [ ] Autoplay videos can be paused
- [ ] No flashing (>3/second)
- [ ] Dynamic content announced (aria-live)
- [ ] Focus management handled
- [ ] Modal traps focus correctly
- [ ] Close button always available

### For Content

- [ ] Sufficient color contrast
- [ ] Color not sole info indicator
- [ ] Font sizes readable
- [ ] Line spacing adequate
- [ ] Content structure clear
- [ ] Links descriptive (no "click here")
- [ ] Jargon explained
- [ ] Lists properly marked

---

## ARIA Landmark Roles

**Use semantic elements when possible, ARIA roles as fallback:**

```html
<header role="banner"></header>
<nav role="navigation"></nav>
<main role="main"></main>
<aside role="complementary"></aside>
<footer role="contentinfo"></footer>

<!-- Or use semantic HTML (better) -->
<header></header>
<nav></nav>
<main></main>
<aside></aside>
<footer></footer>
```

---

## Common Accessibility Issues & Fixes

| Issue              | Problem                              | Fix                              |
| ------------------ | ------------------------------------ | -------------------------------- |
| No focus outline   | Users can't see where they are       | Use `:focus { outline: ... }`    |
| Color only         | Info only in color                   | Add text or icon                 |
| Images no alt      | Screen readers can't describe        | Add descriptive alt text         |
| Form no labels     | Screen readers don't know what field | Use `<label for="id">`           |
| Low contrast       | Hard to read                         | Increase contrast ratio to 4.5:1 |
| No skip link       | Keyboard users repeat nav            | Add skip link                    |
| Heading not H1     | Structure unclear                    | Use proper heading hierarchy     |
| Button is div      | Not keyboard accessible              | Use `<button>` element           |
| Auto-playing video | Startling, hard to stop              | Add visible play/pause button    |
| No error message   | Users don't know what went wrong     | Show clear error text            |

---

## Accessibility Tools

### Automated Testing

- WAVE (browser extension)
- axe DevTools (browser extension)
- Lighthouse (Chrome DevTools)
- WCAG Contrast Checker

### Manual Testing

- Keyboard navigation
- Screen reader testing
- Browser zoom testing
- Color blindness simulators

### Learning Resources

- Web Accessibility by Google (free course)
- WCAG 2.1 Guidelines
- Inclusive Components
- A11y Project

---

## Accessibility Best Practices

### Do's ✅

- Use semantic HTML
- Test with real assistive technology
- Include keyboard users in testing
- Provide descriptive alt text
- Use sufficient color contrast
- Make focus visible
- Use ARIA correctly
- Test with real users (disabled users)
- Update content accessibly
- Keep accessibility in mind from start

### Don'ts ❌

- Remove focus outlines
- Use color to convey info alone
- Create keyboard traps
- Use non-semantic HTML
- Hide labels (use off-screen instead)
- Rely on tooltips for important info
- Use ARIA to replace semantic HTML
- Ignore mobile accessibility
- Test with browser extensions alone
- Add accessibility at the end

---

## Future Accessibility Enhancements

- Real user testing with disabled users
- WCAG 3.0 preparation
- EN 301 549 (EU standard) compliance
- Voice control optimization
- Eye-tracking support
- Cognitive accessibility improvements
- Video captions and transcripts
- Audio descriptions for images
- High contrast mode support

---

## References & Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [The Inclusive Web](https://www.abrightclear.com/accessibility-services/)
- [Inclusive Components](https://inclusive-components.design/)
