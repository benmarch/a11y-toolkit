# A11y Toolkit

This is a small collection of vanilla JS tools that can be used to make web apps more accessible.

These tools are very low-level building blocks that can be used to implement common accessibility (a11y)
patterns for JavaScript based widgets such as menus, popovers, carousels, etc.

Below is an overview, but you can read the [full documentation](https://benmarch.github.io/a11y-toolkit).

## Resources

Many of the patterns that these tools implement can be found on the 
[WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) and 
[MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility) websites.

These are great places to start when implementing accessible widgets, and the tools in this library
will make it easier to implement the more interactive patterns.

## Vocabulary

This library attempts to stay internally consistent with terminology, although some of the
terms might differ slightly from common terms to either broaden or tighten their scope.

<dl>
  <dt>a11y</dt>
  <dd>"Accessibility" - the degree of usability by people with disabilities</dd>

  <dt>Element-like or "Elemental"</dt>
  <dd>Any DOM object or object that implements EventTarget</dd>

  <dt>Focusable</dt>
  <dd>Any element-like DOM object that has significance when focused.</dd>

  <dt>Interactive</dt>
  <dd>Any element-like DOM object that a user can directly interact with. All interactive elements are focusable, but not all focusable elements are interactive.</dd>
</dl>

## Primitives

Primitives are pure functions that inspect, select, or modified one or more element-like DOM objects.

### Inspectors

Inspectors are functions that accept one or more element-like DOM objects and return information about them. 
For example, `isFocusable` will return a boolean whether a provided Elemental is focusable.

### Selectors

Selectors are functions that return one or more element-like DOM objects (often of a specific type
such as HTMLElement) given specific search criteria. For example, `getFirstFocusableChild` will return
the first focusable HTMLElement within a specific container.

### Modifiers

Modifiers made changes to one or more provided element-like DOM objects. For example, 
`focusFirstFocusableChild` will locate the first focusable HTMLElement within a specific container
and then move the browser's focus to it.

## Managers

Managers are stateful classes that provide higher-level functionality for implementing common
a11y patterns such as a roving tab index or focus trap. Managers do _not_ fully implement any
widget patterns, but are instead used in concert with one another to implement widgets.

Managers can share lists of element-like DOM objects using an `ElementList` that is passed among them.
This way, the consumer can manage the list of elements included in the pattern, and any sub-managers
will share the same list in real time (i.e., it acts as shared memory). Managers do not add or remove
elements from the shared `ElementList`, that is up to the consumer.

## Contributing

If there is an issue with any existing functionality, or if you would like to request some functionality,
please open an issue with as much detail as possible. 