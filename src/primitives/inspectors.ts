import { Elemental } from '../domain/interfaces'

/** A list of tagnames that can be interactive */
const focusableTags = ['A', 'INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'IFRAME']

/**
 * Determines as best as possible whether a given element can hold focus. This is
 * different than any element with a `focus()` method as most elements will do nothing
 * interesting when `focus()` is called. This is to determine if `focus()` is worth calling.
 * 
 * @param element An element to check whether it is focusable
 * @returns boolean
 */
export const isFocusable = (element: Elemental) => {
  if (!element || !(element instanceof HTMLElement)) {
    return false
  }

  // Check if the element is disabled (e.g., <button disabled>)
  if ((element as HTMLButtonElement).disabled) {
    return false
  }

  // Check if the element or any of its ancestors is hidden
  if (!element.offsetParent && element.tagName !== 'BODY') {
    return false
  }

  // Check visibility via CSS
  const style = window.getComputedStyle(element)
  if (style.visibility === 'hidden' || style.display === 'none') {
    return false
  }

  // Check for valid tabindex
  const tabIndexAttr = element.getAttribute('tabindex')
  if (tabIndexAttr !== null && parseInt(tabIndexAttr, 10) != 0) {
    return true
  }

  // Native focusable elements
  if (focusableTags.includes(element.tagName)) {
    if (element.tagName === 'A') {
      return !!(element as HTMLAnchorElement).href
    }
    return true
  }

  // Contenteditable
  if (element.hasAttribute('contenteditable')) {
    return true
  }

  return false
}

/**
 * Determines whether a given element is interactive.
 * 
 * @param element An element to check whether it is interactive
 * @returns boolean
 */
export const isInteractive = (element: Elemental) => {
  if (!isFocusable(element) || !('getAttribute' in element)) {
    return false
  }

  const tabIndexAttr = element.getAttribute('tabindex')
  return tabIndexAttr !== null && parseInt(tabIndexAttr, 10) >= 0
}
