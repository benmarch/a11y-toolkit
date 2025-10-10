export interface NavigationEvent {
  event: KeyboardEvent | MouseEvent | FocusEvent
  type: 'FROM' | 'TO'
  fromElement: Element | null
  toElement: Element | null
  isTabNavigating: boolean
  isArrowKeyNavigating: boolean
  isKeyboardNavigating: boolean
  isMouseNavigating: boolean
  isForwardNavigating: boolean
  isBackwardNavigating: boolean
}

export interface NavigationObserverOptions {
  isActive?: boolean
}

/**
 * The `NavigationObserver` watches user navigation events within a container.
 * This includes tabbing, using arrow keys, and mouse interactions.
 *
 * Consumers can subscribe to navigation events and filter based on interest.
 *
 * There are broadly two types of navigation events:
 *
 * 1. "FROM" events - triggered when the user navigates away from an element
 * 2. "TO" events - triggered when the user navigates to an element
 *
 * Often, these events are triggered back to back, so it is important for consumers
 * to filter based on requirements.
 *
 * Generally, keyboard events are considered "FROM" events, while mouse and focus
 * events are considered "TO" events.
 */
export default class NavigationObserver {
  container: HTMLElement
  options: NavigationObserverOptions
  isActive = false
  subscribers: ((event: NavigationEvent) => void)[] = []

  isTabNavigating = false
  isArrowKeyNavigating = false
  isKeyboardNavigating = false
  isMouseNavigating = false
  isForwardNavigating = false
  isBackwardNavigating = false
  didNavigate = false
  fromElement: Element | null = null
  toElement: Element | null = null

  constructor(container: HTMLElement = document.body, options: NavigationObserverOptions = {}) {
    this.container = container
    this.options = options

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)

    if (options.isActive) {
      this.activate()
    }
  }

  activate() {
    if (this.isActive) {
      return
    }

    this.isActive = true
    this.toElement = document.activeElement

    this.container.addEventListener('keydown', this.handleKeyDown, true)
    this.container.addEventListener('mousedown', this.handleMouseDown, true)
    this.container.addEventListener('focus', this.handleFocus, true)
  }

  deactivate() {
    if (!this.isActive) {
      return
    }

    this.isActive = false

    this.container.removeEventListener('keydown', this.handleKeyDown, true)
    this.container.removeEventListener('mousedown', this.handleMouseDown, true)
    this.container.removeEventListener('focus', this.handleFocus, true)
  }

  /**
   * Subscribe to navigation events by providing a callback that accepts a `NavigationEvent`.
   * This returns an `unsubscribe` function that should be called when the consumer is
   * no longer interested in receiving events to prevent memory leaks.
   *
   * @param subscriber A callback function that will receive navigation events
   * @returns An `unsubscribe` function
   */
  onNavigate(subscriber: (event: NavigationEvent) => void) {
    this.subscribers.push(subscriber)

    return () => {
      this.subscribers = this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
    }
  }

  /**
   * Listens for keyboard events within the container.
   * Keyboard events are considered "FROM" events.
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isActive) {
      return
    }

    this.didNavigate = false

    // Tab key navigation
    if (event.key === 'Tab') {
      this.didNavigate = true
      this.isTabNavigating = true
      this.isKeyboardNavigating = true
      this.isArrowKeyNavigating = false
      this.isMouseNavigating = false

      // holding shift implies backward navigation
      if (event.shiftKey) {
        this.isBackwardNavigating = true
        this.isForwardNavigating = false
      } else {
        this.isForwardNavigating = true
        this.isBackwardNavigating = false
      }

      // emit the event
      this.emitNavigationEvent(event, {
        type: 'FROM',
        fromElement: event.target instanceof Element ? event.target : null,
        toElement: null,
      })
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      // Arrow key navigation
      this.didNavigate = true
      this.isTabNavigating = false
      this.isKeyboardNavigating = true
      this.isArrowKeyNavigating = true
      this.isMouseNavigating = false

      // Up and Left arrow keys are generally backward, while Down and Right are generally forward
      if (['ArrowUp', 'ArrowLeft'].includes(event.key)) {
        this.isBackwardNavigating = true
        this.isForwardNavigating = false
      } else {
        this.isForwardNavigating = true
        this.isBackwardNavigating = false
      }

      this.emitNavigationEvent(event, {
        type: 'FROM',
        fromElement: event.target instanceof Element ? event.target : null,
        toElement: null,
      })
    }
  }

  /**
   * Listens for mouse events within the container.
   * All mouse events are considered "TO" events.
   */
  private handleMouseDown = (event: MouseEvent) => {
    if (!this.isActive) {
      return
    }

    this.isMouseNavigating = true
    this.isTabNavigating = false
    this.isKeyboardNavigating = false
    this.isArrowKeyNavigating = false
    this.isForwardNavigating = false
    this.isBackwardNavigating = false
    this.fromElement = this.toElement
    this.toElement = event.target instanceof Element ? event.target : null

    this.emitNavigationEvent(event)
  }

  /**
   * Listens for focus events within the container.
   * Focus events are considered "TO" events.
   */
  private handleFocus = (event: FocusEvent) => {
    if (!this.isActive) {
      return
    }

    if (event.target && event.target instanceof Element && event.target !== this.toElement) {
      this.fromElement = this.toElement
      this.toElement = event.target

      this.emitNavigationEvent(event)
    }
  }

  private emitNavigationEvent(
    event: KeyboardEvent | MouseEvent | FocusEvent,
    overrides: Partial<NavigationEvent> = {},
  ) {
    this.subscribers.forEach((subscriber) =>
      subscriber({
        event,
        type: 'TO',
        fromElement: this.fromElement,
        toElement: this.toElement,
        isTabNavigating: this.isTabNavigating,
        isArrowKeyNavigating: this.isArrowKeyNavigating,
        isKeyboardNavigating: this.isKeyboardNavigating,
        isMouseNavigating: this.isMouseNavigating,
        isForwardNavigating: this.isForwardNavigating,
        isBackwardNavigating: this.isBackwardNavigating,
        ...overrides,
      }),
    )
  }
}
