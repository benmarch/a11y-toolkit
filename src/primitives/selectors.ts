import { Elemental } from '../domain/interfaces'

/**
 * Searches for all focusable elements inside a given container element.
 * Will return an array of HTMLElement unless the container is not a valid Element.
 * 
 * @param container Container element to search within
 * @returns All focusable elements inside the container
 */
export const getFocusableChildren = (container: Elemental): HTMLElement[] | null => {
  if (!('querySelectorAll' in container)) {
    return null
  }

  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex], [contenteditable]',
  )

  return [...elements]
}

/**
 * Searches for all interactive elements inside a given container element.
 * Will return an array of HTMLElement unless the container is not a valid Element.
 * 
 * @param container Container element to search within
 * @returns All interactive elements inside the container
 */
export const getInteractiveChildren = (container: Elemental): HTMLElement[] | null => {
  if (!('querySelectorAll' in container)) {
    return null
  }

  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable]',
  )

  return [...elements]
}

/**
 * Searches within a given container and returns the first focusable element.
 * 
 * @param container Container element to search within
 * @returns The first focusable element within the container or null
 */
export const getFirstFocusableChild = (container: Elemental): HTMLElement | null => {
  return getFocusableChildren(container)?.[0] ?? null
}

/**
 * Searches within a given container and returns the first interactive element.
 * 
 * @param container Container element to search within
 * @returns The first interactive element within the container or null
 */
export const getFirstInteractiveChild = (container: Elemental): HTMLElement | null => {
  return getInteractiveChildren(container)?.[0] ?? null
}

/**
 * Searches within a given container and returns the last focusable element.
 * 
 * @param container Container element to search within
 * @returns The last focusable element within the container or null
 */
export const getLastFocusableChild = (container: Elemental): HTMLElement | null => {
  const elements = getFocusableChildren(container) ?? []

  return elements[elements.length - 1] || null
}

/**
 * Searches within a given container and returns the last interactive element.
 * 
 * @param container Container element to search within
 * @returns The last interactive element within the container or null
 */
export const getLastInteractiveChild = (container: Elemental): HTMLElement | null => {
  const elements = getInteractiveChildren(container) ?? []

  return elements[elements.length - 1] || null
}