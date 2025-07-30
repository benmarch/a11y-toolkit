import { Elemental } from '../domain/interfaces'

export const getFocusableChildren = (container: Elemental): HTMLElement[] | null => {
  if (!('querySelectorAll' in container)) {
    return null
  }

  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex], [contenteditable]',
  )

  return [...elements]
}

export const getInteractiveChildren = (container: Elemental): HTMLElement[] | null => {
  if (!('querySelectorAll' in container)) {
    return null
  }

  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable]',
  )

  return [...elements]
}

export const getFirstFocusable = (container: Elemental): HTMLElement | null => {
  return getFocusableChildren(container)?.[0] ?? null
}

export const getFirstInteractive = (container: Elemental): HTMLElement | null => {
  return getInteractiveChildren(container)?.[0] ?? null
}

export const getLastFocusable = (container: Elemental): HTMLElement | null => {
  const elements = getFocusableChildren(container) ?? []

  return elements[elements.length - 1] || null
}

export const getLastInteractive = (container: Elemental): HTMLElement | null => {
  const elements = getInteractiveChildren(container) ?? []

  return elements[elements.length - 1] || null
}