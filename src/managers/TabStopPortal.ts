import { FocusableElement } from '../domain/interfaces'
import {
  focusFirstInteractiveChild,
  focusLastInteractiveChild,
  focusNextInteractiveElement,
  focusPreviousInteractiveElement,
} from '../primitives/modifiers'
import { getFirstFocusableChild, getLastFocusableChild } from '../primitives/selectors'
import NavigationObserver, { NavigationEvent } from './NavigationObserver'

export interface TabStopPortalOptions {
  isActive?: boolean
  after?: FocusableElement
  before?: FocusableElement
}

/**
 * Creates a virtual tab stop portal where an element that resides elsewhere in the DOM is
 * treated as if it were immediately before or after another element while tab navigating.
 *
 * This allows for elements to be placed anywhere in the DOM, but retain a logical tab order.
 *
 * > Note: only `before` _or_ `after` can be set, not both.
 *
 * Clicking outside the portal container will deactivate the portal.
 *
 * -------
 *
 * There are 4 virtual tab stops managed by the TabStopPortal:
 *
 * When placed `after` an element, the tab order looks like this:
 *
 * ["previous" element] -> ["after" element] -> [portal] -> ["next" element]
 *
 * A1. When tabbing forward past the "after" element, the first element in the portal is focused
 * A2. When tabbing forward past the last element in the portal, the "next" element is focused
 * A3. When tabbing backward past the "next" element, the last element in the portal is focused
 * A4. When tabbing backward past the first element in the portal, the "after" element is focused
 *
 * When placed `before` an element:
 *
 * ["previous" element] -> [portal] -> ["before" element] -> ["next" element]
 *
 * B1. When tabbing forward past the "previous" element, the first element in the portal is focused
 * B2. When tabbing forward past the last element in the portal, the "before" element is focused
 * B3. When tabbing backward past the "before" element, the last element in the portal is focused
 * B4. When tabbing backward past the first element in the portal, the "previous" element is focused
 *
 */
export default class TabStopPortal {
  portalContainer: HTMLElement
  options: TabStopPortalOptions
  navigationObserver: NavigationObserver = new NavigationObserver()
  unsubscribe?: () => void
  isActive = false
  isPortalling = false

  constructor(portalContainer: HTMLElement, options: TabStopPortalOptions) {
    this.portalContainer = portalContainer
    this.options = options

    this.handleNavigation = this.handleNavigation.bind(this)

    if (options.isActive) {
      this.activate()
    }
  }

  activate() {
    if (this.isActive) {
      return
    }

    this.isActive = true
    this.navigationObserver.activate()

    this.unsubscribe = this.navigationObserver.onNavigate(this.handleNavigation)
  }

  deactivate() {
    if (!this.isActive) {
      return
    }

    this.isActive = false
    this.navigationObserver.deactivate()

    this.unsubscribe?.()
  }

  private handleNavigation(navEvent: NavigationEvent) {
    if (!this.isActive) {
      return
    }

    const {
      event,
      fromElement,
      toElement,
      isTabNavigating,
      isMouseNavigating,
      isForwardNavigating,
      isBackwardNavigating,
    } = navEvent

    // Check if the mouse is navigating outside the portal container
    if (isMouseNavigating && toElement !== this.portalContainer && !this.portalContainer.contains(toElement)) {
      this.isPortalling = false
    }

    // we only care about tab navigation
    if (!isTabNavigating) {
      return
    }

    // when `after` is provided
    if (this.options.after) {
      // handle A1
      if (isForwardNavigating && fromElement === this.options.after && !this.isPortalling) {
        this.isPortalling = true
        event.preventDefault()
        focusFirstInteractiveChild(this.portalContainer)
      }

      // handle A2
      if (isForwardNavigating && fromElement === getLastFocusableChild(this.portalContainer) && this.isPortalling) {
        this.isPortalling = false
        event.preventDefault()
        focusNextInteractiveElement(document.body, this.options.after)
      }

      // handle A3
      if (
        isBackwardNavigating &&
        toElement === this.options.after &&
        !this.isPortalling &&
        fromElement !== getFirstFocusableChild(this.portalContainer)
      ) {
        this.isPortalling = true
        event.preventDefault()
        focusLastInteractiveChild(this.portalContainer)
      }

      // handle A4
      if (isBackwardNavigating && fromElement === getFirstFocusableChild(this.portalContainer) && this.isPortalling) {
        this.isPortalling = false
        event.preventDefault()
        this.options.after.focus()
      }
    }

    // when `before` is provided
    if (this.options.before) {
      // handle B1
      if (
        isForwardNavigating &&
        toElement === this.options.before &&
        !this.isPortalling &&
        fromElement !== getLastFocusableChild(this.portalContainer)
      ) {
        this.isPortalling = true
        event.preventDefault()
        focusFirstInteractiveChild(this.portalContainer)
      }

      // handle B2
      if (isForwardNavigating && fromElement === getLastFocusableChild(this.portalContainer) && this.isPortalling) {
        this.isPortalling = false
        event.preventDefault()
        this.options.before.focus()
      }

      // handle B3
      if (isBackwardNavigating && fromElement === this.options.before && !this.isPortalling) {
        this.isPortalling = true
        event.preventDefault()
        focusLastInteractiveChild(this.portalContainer)
      }

      // handle B4
      if (isBackwardNavigating && fromElement === getFirstFocusableChild(this.portalContainer) && this.isPortalling) {
        this.isPortalling = false
        event.preventDefault()
        focusPreviousInteractiveElement(document.body, this.options.before)
      }
    }
  }
}
