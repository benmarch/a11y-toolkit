import NavigationObserver, { NavigationObserverOptions } from '../NavigationObserver'

describe('NavigationObserver', () => {
  let container: HTMLElement
  let navigationObserver: NavigationObserver
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    element1 = document.createElement('button')
    element2 = document.createElement('input')
    element3 = document.createElement('a')

    container.appendChild(element1)
    container.appendChild(element2)
    container.appendChild(element3)
    document.body.appendChild(container)

    // Mock focus methods
    element1.focus = jest.fn()
    element2.focus = jest.fn()
    element3.focus = jest.fn()

    jest.clearAllMocks()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('constructor', () => {
    it('should create NavigationObserver with default container and options', () => {
      navigationObserver = new NavigationObserver()

      expect(navigationObserver.container).toBe(document.body)
      expect(navigationObserver.isActive).toBe(false)
      expect(navigationObserver.options).toEqual({})
      expect(navigationObserver.subscribers).toEqual([])
    })

    it('should create NavigationObserver with custom container', () => {
      navigationObserver = new NavigationObserver(container)

      expect(navigationObserver.container).toBe(container)
      expect(navigationObserver.isActive).toBe(false)
    })

    it('should create NavigationObserver with custom options', () => {
      const options: NavigationObserverOptions = { isActive: false }
      navigationObserver = new NavigationObserver(container, options)

      expect(navigationObserver.options).toBe(options)
      expect(navigationObserver.isActive).toBe(false)
    })

    it('should activate immediately when isActive option is true', () => {
      navigationObserver = new NavigationObserver(container, { isActive: true })

      expect(navigationObserver.isActive).toBe(true)
    })

    it('should initialize navigation state properties', () => {
      navigationObserver = new NavigationObserver(container)

      expect(navigationObserver.isTabNavigating).toBe(false)
      expect(navigationObserver.isArrowKeyNavigating).toBe(false)
      expect(navigationObserver.isKeyboardNavigating).toBe(false)
      expect(navigationObserver.isMouseNavigating).toBe(false)
      expect(navigationObserver.isForwardNavigating).toBe(false)
      expect(navigationObserver.isBackwardNavigating).toBe(false)
      expect(navigationObserver.didNavigate).toBe(false)
      expect(navigationObserver.fromElement).toBeNull()
      expect(navigationObserver.toElement).toBeNull()
    })

    it('should set toElement to current activeElement on initialization when active', () => {
      Object.defineProperty(document, 'activeElement', {
        value: element1,
        writable: true,
        configurable: true,
      })

      navigationObserver = new NavigationObserver(container, { isActive: true })

      expect(navigationObserver.toElement).toBe(element1)
    })
  })

  describe('activate', () => {
    beforeEach(() => {
      navigationObserver = new NavigationObserver(container)
    })

    it('should set isActive to true', () => {
      navigationObserver.activate()

      expect(navigationObserver.isActive).toBe(true)
    })

    it('should add event listeners to container', () => {
      const addEventListenerSpy = jest.spyOn(container, 'addEventListener')

      navigationObserver.activate()

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true)
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true)
      expect(addEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function), true)
      expect(addEventListenerSpy).toHaveBeenCalledTimes(3)

      addEventListenerSpy.mockRestore()
    })

    it('should set toElement to current activeElement', () => {
      Object.defineProperty(document, 'activeElement', {
        value: element2,
        writable: true,
        configurable: true,
      })

      navigationObserver.activate()

      expect(navigationObserver.toElement).toBe(element2)
    })

    it('should not add listeners twice when already active', () => {
      navigationObserver.isActive = true
      const addEventListenerSpy = jest.spyOn(container, 'addEventListener')

      navigationObserver.activate()

      expect(addEventListenerSpy).not.toHaveBeenCalled()

      addEventListenerSpy.mockRestore()
    })
  })

  describe('deactivate', () => {
    beforeEach(() => {
      navigationObserver = new NavigationObserver(container)
      navigationObserver.activate()
    })

    it('should set isActive to false', () => {
      navigationObserver.deactivate()

      expect(navigationObserver.isActive).toBe(false)
    })

    it('should remove event listeners from container', () => {
      const removeEventListenerSpy = jest.spyOn(container, 'removeEventListener')

      navigationObserver.deactivate()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true)
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), true)
      expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function), true)
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(3)

      removeEventListenerSpy.mockRestore()
    })

    it('should not remove listeners twice when already inactive', () => {
      navigationObserver.isActive = false
      const removeEventListenerSpy = jest.spyOn(container, 'removeEventListener')

      navigationObserver.deactivate()

      expect(removeEventListenerSpy).not.toHaveBeenCalled()

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('onNavigate', () => {
    beforeEach(() => {
      navigationObserver = new NavigationObserver(container)
    })

    it('should add subscriber to subscribers array', () => {
      const mockSubscriber = jest.fn()

      navigationObserver.onNavigate(mockSubscriber)

      expect(navigationObserver.subscribers).toContain(mockSubscriber)
    })

    it('should return unsubscribe function', () => {
      const mockSubscriber = jest.fn()

      const unsubscribe = navigationObserver.onNavigate(mockSubscriber)

      expect(typeof unsubscribe).toBe('function')
    })

    it('should remove subscriber when unsubscribe is called', () => {
      const mockSubscriber = jest.fn()

      const unsubscribe = navigationObserver.onNavigate(mockSubscriber)
      expect(navigationObserver.subscribers).toContain(mockSubscriber)

      unsubscribe()
      expect(navigationObserver.subscribers).toEqual([])
    })

    it('should support multiple subscribers', () => {
      const subscriber1 = jest.fn()
      const subscriber2 = jest.fn()

      navigationObserver.onNavigate(subscriber1)
      navigationObserver.onNavigate(subscriber2)

      expect(navigationObserver.subscribers).toHaveLength(2)
      expect(navigationObserver.subscribers).toContain(subscriber1)
      expect(navigationObserver.subscribers).toContain(subscriber2)
    })
  })

  describe('keyboard event handling', () => {
    let mockSubscriber: jest.Mock
    let unsubscribe: () => void

    beforeEach(() => {
      navigationObserver = new NavigationObserver(container)
      navigationObserver.activate()
      mockSubscriber = jest.fn()
      unsubscribe = navigationObserver.onNavigate(mockSubscriber)
    })

    afterEach(() => {
      unsubscribe()
    })

    describe('Tab key navigation', () => {
      it('should handle forward tab navigation', () => {
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false })
        Object.defineProperty(tabEvent, 'target', { value: element1 })

        container.dispatchEvent(tabEvent)

        expect(mockSubscriber).toHaveBeenCalledWith({
          event: tabEvent,
          type: 'FROM',
          fromElement: element1,
          toElement: null,
          isTabNavigating: true,
          isArrowKeyNavigating: false,
          isKeyboardNavigating: true,
          isMouseNavigating: false,
          isForwardNavigating: true,
          isBackwardNavigating: false,
        })
      })

      it('should handle backward tab navigation (Shift+Tab)', () => {
        const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
        Object.defineProperty(shiftTabEvent, 'target', { value: element2 })

        container.dispatchEvent(shiftTabEvent)

        expect(mockSubscriber).toHaveBeenCalledWith({
          event: shiftTabEvent,
          type: 'FROM',
          fromElement: element2,
          toElement: null,
          isTabNavigating: true,
          isArrowKeyNavigating: false,
          isKeyboardNavigating: true,
          isMouseNavigating: false,
          isForwardNavigating: false,
          isBackwardNavigating: true,
        })
      })

      it('should set didNavigate flag when tab is pressed', () => {
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })

        container.dispatchEvent(tabEvent)

        expect(navigationObserver.didNavigate).toBe(true)
      })
    })

    describe('Arrow key navigation', () => {
      it('should handle ArrowDown as forward navigation', () => {
        const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
        Object.defineProperty(downEvent, 'target', { value: element1 })

        container.dispatchEvent(downEvent)

        expect(mockSubscriber).toHaveBeenCalledWith({
          event: downEvent,
          type: 'FROM',
          fromElement: element1,
          toElement: null,
          isTabNavigating: false,
          isArrowKeyNavigating: true,
          isKeyboardNavigating: true,
          isMouseNavigating: false,
          isForwardNavigating: true,
          isBackwardNavigating: false,
        })
      })

      it('should handle ArrowRight as forward navigation', () => {
        const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
        Object.defineProperty(rightEvent, 'target', { value: element2 })

        container.dispatchEvent(rightEvent)

        expect(mockSubscriber).toHaveBeenCalledWith({
          event: rightEvent,
          type: 'FROM',
          fromElement: element2,
          toElement: null,
          isTabNavigating: false,
          isArrowKeyNavigating: true,
          isKeyboardNavigating: true,
          isMouseNavigating: false,
          isForwardNavigating: true,
          isBackwardNavigating: false,
        })
      })

      it('should handle ArrowUp as backward navigation', () => {
        const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' })
        Object.defineProperty(upEvent, 'target', { value: element3 })

        container.dispatchEvent(upEvent)

        expect(mockSubscriber).toHaveBeenCalledWith({
          event: upEvent,
          type: 'FROM',
          fromElement: element3,
          toElement: null,
          isTabNavigating: false,
          isArrowKeyNavigating: true,
          isKeyboardNavigating: true,
          isMouseNavigating: false,
          isForwardNavigating: false,
          isBackwardNavigating: true,
        })
      })

      it('should handle ArrowLeft as backward navigation', () => {
        const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
        Object.defineProperty(leftEvent, 'target', { value: element1 })

        container.dispatchEvent(leftEvent)

        expect(mockSubscriber).toHaveBeenCalledWith({
          event: leftEvent,
          type: 'FROM',
          fromElement: element1,
          toElement: null,
          isTabNavigating: false,
          isArrowKeyNavigating: true,
          isKeyboardNavigating: true,
          isMouseNavigating: false,
          isForwardNavigating: false,
          isBackwardNavigating: true,
        })
      })
    })

    describe('other keys', () => {
      it('should ignore non-navigation keys', () => {
        const spaceEvent = new KeyboardEvent('keydown', { key: 'Space' })
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })

        container.dispatchEvent(spaceEvent)
        container.dispatchEvent(enterEvent)
        container.dispatchEvent(escapeEvent)

        expect(mockSubscriber).not.toHaveBeenCalled()
        expect(navigationObserver.didNavigate).toBe(false)
      })
    })

    describe('when inactive', () => {
      it('should ignore all keyboard events when inactive', () => {
        navigationObserver.isActive = false

        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
        const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })

        container.dispatchEvent(tabEvent)
        container.dispatchEvent(arrowEvent)

        expect(mockSubscriber).not.toHaveBeenCalled()
      })
    })
  })

  describe('mouse event handling', () => {
    let mockSubscriber: jest.Mock
    let unsubscribe: () => void

    beforeEach(() => {
      navigationObserver = new NavigationObserver(container)
      navigationObserver.activate()
      mockSubscriber = jest.fn()
      unsubscribe = navigationObserver.onNavigate(mockSubscriber)
    })

    afterEach(() => {
      unsubscribe()
    })

    it('should handle mouse down events', () => {
      navigationObserver.toElement = element1 // Set previous state

      const mouseEvent = new MouseEvent('mousedown')
      Object.defineProperty(mouseEvent, 'target', { value: element2 })

      container.dispatchEvent(mouseEvent)

      expect(mockSubscriber).toHaveBeenCalledWith({
        event: mouseEvent,
        type: 'TO',
        fromElement: element1,
        toElement: element2,
        isTabNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: false,
        isMouseNavigating: true,
        isForwardNavigating: false,
        isBackwardNavigating: false,
      })
    })

    it('should update fromElement and toElement on mouse events', () => {
      navigationObserver.toElement = element1

      const mouseEvent = new MouseEvent('mousedown')
      Object.defineProperty(mouseEvent, 'target', { value: element2 })

      container.dispatchEvent(mouseEvent)

      expect(navigationObserver.fromElement).toBe(element1)
      expect(navigationObserver.toElement).toBe(element2)
    })

    it('should handle mouse event with non-Element target', () => {
      const mouseEvent = new MouseEvent('mousedown')
      Object.defineProperty(mouseEvent, 'target', { value: document })

      container.dispatchEvent(mouseEvent)

      expect(navigationObserver.toElement).toBeNull()
    })

    it('should ignore mouse events when inactive', () => {
      navigationObserver.isActive = false

      const mouseEvent = new MouseEvent('mousedown')
      Object.defineProperty(mouseEvent, 'target', { value: element1 })

      container.dispatchEvent(mouseEvent)

      expect(mockSubscriber).not.toHaveBeenCalled()
    })
  })

  describe('focus event handling', () => {
    let mockSubscriber: jest.Mock
    let unsubscribe: () => void

    beforeEach(() => {
      navigationObserver = new NavigationObserver(container)
      navigationObserver.activate()
      mockSubscriber = jest.fn()
      unsubscribe = navigationObserver.onNavigate(mockSubscriber)
    })

    afterEach(() => {
      unsubscribe()
    })

    it('should handle focus events with new target', () => {
      navigationObserver.toElement = element1

      const focusEvent = new FocusEvent('focus')
      Object.defineProperty(focusEvent, 'target', { value: element2 })

      container.dispatchEvent(focusEvent)

      expect(mockSubscriber).toHaveBeenCalledWith({
        event: focusEvent,
        type: 'TO',
        fromElement: element1,
        toElement: element2,
        isTabNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: false,
        isMouseNavigating: false,
        isForwardNavigating: false,
        isBackwardNavigating: false,
      })
    })

    it('should update fromElement and toElement on focus events', () => {
      navigationObserver.toElement = element1

      const focusEvent = new FocusEvent('focus')
      Object.defineProperty(focusEvent, 'target', { value: element3 })

      container.dispatchEvent(focusEvent)

      expect(navigationObserver.fromElement).toBe(element1)
      expect(navigationObserver.toElement).toBe(element3)
    })

    it('should ignore focus events with same target', () => {
      navigationObserver.toElement = element1

      const focusEvent = new FocusEvent('focus')
      Object.defineProperty(focusEvent, 'target', { value: element1 })

      container.dispatchEvent(focusEvent)

      expect(mockSubscriber).not.toHaveBeenCalled()
    })

    it('should ignore focus events with null target', () => {
      const focusEvent = new FocusEvent('focus')
      Object.defineProperty(focusEvent, 'target', { value: null })

      container.dispatchEvent(focusEvent)

      expect(mockSubscriber).not.toHaveBeenCalled()
    })

    it('should ignore focus events with non-Element target', () => {
      const focusEvent = new FocusEvent('focus')
      Object.defineProperty(focusEvent, 'target', { value: document })

      container.dispatchEvent(focusEvent)

      expect(mockSubscriber).not.toHaveBeenCalled()
    })

    it('should ignore focus events when inactive', () => {
      navigationObserver.isActive = false

      const focusEvent = new FocusEvent('focus')
      Object.defineProperty(focusEvent, 'target', { value: element1 })

      container.dispatchEvent(focusEvent)

      expect(mockSubscriber).not.toHaveBeenCalled()
    })
  })

  describe('integration scenarios', () => {
    it('should support complete navigation workflow', () => {
      const observer = new NavigationObserver(container)
      const subscriber1 = jest.fn()
      const subscriber2 = jest.fn()

      // Subscribe to events
      const unsubscribe1 = observer.onNavigate(subscriber1)
      const unsubscribe2 = observer.onNavigate(subscriber2)

      // Activate observer
      observer.activate()
      expect(observer.isActive).toBe(true)

      // Simulate tab navigation
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      Object.defineProperty(tabEvent, 'target', { value: element1 })
      container.dispatchEvent(tabEvent)

      // Both subscribers should receive the event
      expect(subscriber1).toHaveBeenCalledTimes(1)
      expect(subscriber2).toHaveBeenCalledTimes(1)

      // Simulate focus event
      const focusEvent = new FocusEvent('focus')
      Object.defineProperty(focusEvent, 'target', { value: element2 })
      container.dispatchEvent(focusEvent)

      expect(subscriber1).toHaveBeenCalledTimes(2)
      expect(subscriber2).toHaveBeenCalledTimes(2)

      // Unsubscribe one subscriber (note: due to bug, subscriber1 becomes the array)
      unsubscribe1()

      // Simulate mouse event - should not throw anymore since the bug is fixed
      const mouseEvent = new MouseEvent('mousedown')
      Object.defineProperty(mouseEvent, 'target', { value: element3 })

      // Should not throw since unsubscribe now works correctly
      expect(() => container.dispatchEvent(mouseEvent)).not.toThrow()

      // Clean up
      unsubscribe2()
    })

    it('should handle sequential keyboard and mouse navigation', () => {
      const observer = new NavigationObserver(container, { isActive: true })
      const subscriber = jest.fn()
      const unsubscribe = observer.onNavigate(subscriber)

      // Start with tab navigation
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      Object.defineProperty(tabEvent, 'target', { value: element1 })
      container.dispatchEvent(tabEvent)

      expect(observer.isTabNavigating).toBe(true)
      expect(observer.isMouseNavigating).toBe(false)

      // Switch to mouse navigation
      const mouseEvent = new MouseEvent('mousedown')
      Object.defineProperty(mouseEvent, 'target', { value: element2 })
      container.dispatchEvent(mouseEvent)

      expect(observer.isTabNavigating).toBe(false)
      expect(observer.isMouseNavigating).toBe(true)

      // Switch to arrow key navigation
      const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      Object.defineProperty(arrowEvent, 'target', { value: element2 })
      container.dispatchEvent(arrowEvent)

      expect(observer.isArrowKeyNavigating).toBe(true)
      expect(observer.isTabNavigating).toBe(false)
      expect(observer.isMouseNavigating).toBe(false)

      expect(subscriber).toHaveBeenCalledTimes(3)
      unsubscribe()
    })

    it('should handle multiple containers independently', () => {
      const container2 = document.createElement('div')
      const element4 = document.createElement('span')
      container2.appendChild(element4)
      document.body.appendChild(container2)

      const observer1 = new NavigationObserver(container, { isActive: true })
      const observer2 = new NavigationObserver(container2, { isActive: true })

      const subscriber1 = jest.fn()
      const subscriber2 = jest.fn()

      observer1.onNavigate(subscriber1)
      observer2.onNavigate(subscriber2)

      // Event in container1
      const event1 = new KeyboardEvent('keydown', { key: 'Tab' })
      Object.defineProperty(event1, 'target', { value: element1 })
      container.dispatchEvent(event1)

      expect(subscriber1).toHaveBeenCalledTimes(1)
      expect(subscriber2).not.toHaveBeenCalled()

      // Event in container2
      const event2 = new KeyboardEvent('keydown', { key: 'Tab' })
      Object.defineProperty(event2, 'target', { value: element4 })
      container2.dispatchEvent(event2)

      expect(subscriber1).toHaveBeenCalledTimes(1)
      expect(subscriber2).toHaveBeenCalledTimes(1)

      document.body.removeChild(container2)
    })
  })

  describe('edge cases', () => {
    beforeEach(() => {
      navigationObserver = new NavigationObserver(container)
    })

    it('should handle unsubscribe called multiple times', () => {
      const subscriber = jest.fn()
      const unsubscribe = navigationObserver.onNavigate(subscriber)

      expect(navigationObserver.subscribers).toContain(subscriber)

      unsubscribe()
      expect(navigationObserver.subscribers).toEqual([])

      // Should not throw when called again and should be safe
      expect(() => unsubscribe()).not.toThrow()
      expect(navigationObserver.subscribers).toEqual([])
    })

    it('should handle activate/deactivate cycles', () => {
      // Multiple activations
      navigationObserver.activate()
      navigationObserver.activate()
      navigationObserver.activate()
      expect(navigationObserver.isActive).toBe(true)

      // Multiple deactivations
      navigationObserver.deactivate()
      navigationObserver.deactivate()
      navigationObserver.deactivate()
      expect(navigationObserver.isActive).toBe(false)
    })

    it('should handle empty subscribers list gracefully', () => {
      navigationObserver.activate()

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      Object.defineProperty(tabEvent, 'target', { value: element1 })

      expect(() => container.dispatchEvent(tabEvent)).not.toThrow()
    })

    it('should handle subscriber that throws an error', () => {
      navigationObserver.activate()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const badSubscriber = jest.fn(() => {
        throw new Error('Subscriber error')
      })
      const goodSubscriber = jest.fn()

      navigationObserver.onNavigate(badSubscriber)
      navigationObserver.onNavigate(goodSubscriber)

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
      Object.defineProperty(tabEvent, 'target', { value: element1 })

      // Should not throw anymore since errors are caught and logged
      expect(() => container.dispatchEvent(tabEvent)).not.toThrow()

      // Both subscribers should have been called
      expect(badSubscriber).toHaveBeenCalledTimes(1)
      expect(goodSubscriber).toHaveBeenCalledTimes(1)

      // Error should have been logged
      expect(consoleSpy).toHaveBeenCalledWith('NavigationObserver subscriber error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})
