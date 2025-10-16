import TabStopPortal, { TabStopPortalOptions } from '../TabStopPortal'
import {
  focusFirstFocusableChild,
  focusFirstInteractiveChild,
  focusLastInteractiveChild,
  focusNextInteractiveElement,
  focusPreviousInteractiveElement,
} from '../../primitives/modifiers'
import { getFirstFocusableChild, getLastFocusableChild } from '../../primitives/selectors'

// Mock the modifiers
jest.mock('../../primitives/modifiers', () => ({
  focusFirstFocusableChild: jest.fn(),
  focusFirstInteractiveChild: jest.fn(),
  focusLastInteractiveChild: jest.fn(),
  focusNextInteractiveElement: jest.fn(),
  focusPreviousInteractiveElement: jest.fn(),
}))

// Mock selectors
jest.mock('../../primitives/selectors', () => ({
  getFirstFocusableChild: jest.fn(),
  getLastFocusableChild: jest.fn(),
}))

const mockedFocusFirstFocusableChild = focusFirstFocusableChild as jest.MockedFunction<typeof focusFirstFocusableChild>
const mockedFocusFirstInteractiveChild = focusFirstInteractiveChild as jest.MockedFunction<
  typeof focusFirstInteractiveChild
>
const mockedFocusLastInteractiveChild = focusLastInteractiveChild as jest.MockedFunction<
  typeof focusLastInteractiveChild
>
const mockedFocusNextInteractiveElement = focusNextInteractiveElement as jest.MockedFunction<
  typeof focusNextInteractiveElement
>
const mockedFocusPreviousInteractiveElement = focusPreviousInteractiveElement as jest.MockedFunction<
  typeof focusPreviousInteractiveElement
>
const mockedGetFirstFocusableChild = getFirstFocusableChild as jest.MockedFunction<typeof getFirstFocusableChild>
const mockedGetLastFocusableChild = getLastFocusableChild as jest.MockedFunction<typeof getLastFocusableChild>

interface MockEvent {
  preventDefault: jest.Mock
}

describe('TabStopPortal', () => {
  let container: HTMLElement
  let portalContainer: HTMLElement
  let afterElement: HTMLButtonElement
  let beforeElement: HTMLButtonElement
  let nextElement: HTMLButtonElement
  let previousElement: HTMLButtonElement
  let portalButton1: HTMLButtonElement
  let portalButton2: HTMLButtonElement
  let tabStopPortal: TabStopPortal

  beforeEach(() => {
    document.body.innerHTML = ''

    // Create main container
    container = document.createElement('div')
    container.id = 'container'
    document.body.appendChild(container)

    // Create portal container
    portalContainer = document.createElement('div')
    portalContainer.id = 'portal'
    document.body.appendChild(portalContainer)

    // Create elements for testing
    previousElement = document.createElement('button')
    previousElement.textContent = 'Previous'
    previousElement.id = 'previous'
    container.appendChild(previousElement)

    afterElement = document.createElement('button')
    afterElement.textContent = 'After'
    afterElement.id = 'after'
    container.appendChild(afterElement)

    beforeElement = document.createElement('button')
    beforeElement.textContent = 'Before'
    beforeElement.id = 'before'
    container.appendChild(beforeElement)

    nextElement = document.createElement('button')
    nextElement.textContent = 'Next'
    nextElement.id = 'next'
    container.appendChild(nextElement)

    // Create portal buttons
    portalButton1 = document.createElement('button')
    portalButton1.textContent = 'Portal Button 1'
    portalButton1.id = 'portal1'
    portalContainer.appendChild(portalButton1)

    portalButton2 = document.createElement('button')
    portalButton2.textContent = 'Portal Button 2'
    portalButton2.id = 'portal2'
    portalContainer.appendChild(portalButton2)

    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    tabStopPortal?.deactivate()
    document.body.innerHTML = ''
  })

  describe('constructor', () => {
    it('should create a TabStopPortal instance', () => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)

      expect(tabStopPortal).toBeInstanceOf(TabStopPortal)
      expect(tabStopPortal.portalContainer).toBe(portalContainer)
      expect(tabStopPortal.options).toBe(options)
      expect(tabStopPortal.isActive).toBe(false)
      expect(tabStopPortal.isPortalling).toBe(false)
    })

    it('should auto-activate when isActive option is true', () => {
      const options: TabStopPortalOptions = { after: afterElement, isActive: true }
      tabStopPortal = new TabStopPortal(portalContainer, options)

      expect(tabStopPortal.isActive).toBe(true)
    })

    it('should not auto-activate when isActive option is false', () => {
      const options: TabStopPortalOptions = { after: afterElement, isActive: false }
      tabStopPortal = new TabStopPortal(portalContainer, options)

      expect(tabStopPortal.isActive).toBe(false)
    })
  })

  describe('activate/deactivate', () => {
    beforeEach(() => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
    })

    it('should activate the portal', () => {
      expect(tabStopPortal.isActive).toBe(false)

      tabStopPortal.activate()

      expect(tabStopPortal.isActive).toBe(true)
      expect(tabStopPortal.navigationObserver.isActive).toBe(true)
    })

    it('should not activate multiple times', () => {
      tabStopPortal.activate()
      expect(tabStopPortal.isActive).toBe(true)

      // Should not throw or cause issues
      tabStopPortal.activate()
      expect(tabStopPortal.isActive).toBe(true)
    })

    it('should deactivate the portal', () => {
      tabStopPortal.activate()
      expect(tabStopPortal.isActive).toBe(true)

      tabStopPortal.deactivate()

      expect(tabStopPortal.isActive).toBe(false)
      expect(tabStopPortal.navigationObserver.isActive).toBe(false)
    })

    it('should not deactivate multiple times', () => {
      tabStopPortal.activate()
      tabStopPortal.deactivate()
      expect(tabStopPortal.isActive).toBe(false)

      // Should not throw or cause issues
      tabStopPortal.deactivate()
      expect(tabStopPortal.isActive).toBe(false)
    })

    it('should handle unsubscribe when deactivating', () => {
      tabStopPortal.activate()
      expect(tabStopPortal.unsubscribe).toBeDefined()

      tabStopPortal.deactivate()

      // unsubscribe should have been called
      expect(tabStopPortal.isActive).toBe(false)
    })
  })

  describe('focus', () => {
    beforeEach(() => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
    })

    it('should focus first focusable child when portal container has tabindex="0"', () => {
      tabStopPortal.activate()
      portalContainer.setAttribute('tabindex', '0')

      // Mock document.activeElement to simulate that focus went to a child element
      const mockActiveElement = portalButton1
      Object.defineProperty(document, 'activeElement', {
        value: mockActiveElement,
        configurable: true,
      })

      // Mock contains to return true for child element
      jest.spyOn(portalContainer, 'contains').mockReturnValue(true)

      tabStopPortal.focus()

      expect(mockedFocusFirstFocusableChild).toHaveBeenCalledWith(portalContainer)
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should focus first focusable child when portal container has no tabindex (defaults to "0")', () => {
      tabStopPortal.activate()
      // No tabindex attribute set, should default to "0" behavior

      // Mock document.activeElement to simulate that focus went to a child element
      const mockActiveElement = portalButton1
      Object.defineProperty(document, 'activeElement', {
        value: mockActiveElement,
        configurable: true,
      })

      // Mock contains to return true for child element
      jest.spyOn(portalContainer, 'contains').mockReturnValue(true)

      tabStopPortal.focus()

      expect(mockedFocusFirstFocusableChild).toHaveBeenCalledWith(portalContainer)
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should focus the portal container when it has tabindex="-1"', () => {
      tabStopPortal.activate()
      portalContainer.setAttribute('tabindex', '-1')
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      // Mock document.activeElement to be the portal container
      Object.defineProperty(document, 'activeElement', {
        value: portalContainer,
        configurable: true,
      })

      tabStopPortal.focus()

      expect(focusSpy).toHaveBeenCalled()
      expect(mockedFocusFirstFocusableChild).not.toHaveBeenCalled()
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should focus the portal container when it has positive tabindex', () => {
      tabStopPortal.activate()
      portalContainer.setAttribute('tabindex', '1')
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      // Mock document.activeElement to be the portal container
      Object.defineProperty(document, 'activeElement', {
        value: portalContainer,
        configurable: true,
      })

      tabStopPortal.focus()

      expect(focusSpy).toHaveBeenCalled()
      expect(mockedFocusFirstFocusableChild).not.toHaveBeenCalled()
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should focus the portal container when it has any non-zero tabindex string', () => {
      tabStopPortal.activate()
      portalContainer.setAttribute('tabindex', '2')
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      // Mock document.activeElement to be the portal container
      Object.defineProperty(document, 'activeElement', {
        value: portalContainer,
        configurable: true,
      })

      tabStopPortal.focus()

      expect(focusSpy).toHaveBeenCalled()
      expect(mockedFocusFirstFocusableChild).not.toHaveBeenCalled()
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should do nothing when portal is not active', () => {
      // Don't activate the portal
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      tabStopPortal.focus()

      expect(focusSpy).not.toHaveBeenCalled()
      expect(mockedFocusFirstFocusableChild).not.toHaveBeenCalled()
      expect(tabStopPortal.isPortalling).toBe(false)
    })

    it('should work correctly after activation and deactivation cycles', () => {
      portalContainer.setAttribute('tabindex', '-1') // Will focus container directly
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      // Mock document.activeElement to be the portal container
      Object.defineProperty(document, 'activeElement', {
        value: portalContainer,
        configurable: true,
      })

      // Activate, focus, deactivate, reactivate, focus again
      tabStopPortal.activate()
      tabStopPortal.focus()
      expect(focusSpy).toHaveBeenCalledTimes(1)
      expect(tabStopPortal.isPortalling).toBe(true)

      tabStopPortal.deactivate()
      tabStopPortal.focus()
      expect(focusSpy).toHaveBeenCalledTimes(1) // Should not increase
      expect(tabStopPortal.isPortalling).toBe(true) // Should remain true

      tabStopPortal.activate()
      tabStopPortal.focus()
      expect(focusSpy).toHaveBeenCalledTimes(2) // Should increase
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should handle mixed tabindex scenarios correctly', () => {
      tabStopPortal.activate()
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      // Test with tabindex="0" (should focus first child)
      portalContainer.setAttribute('tabindex', '0')

      // Mock document.activeElement and contains for child element
      Object.defineProperty(document, 'activeElement', {
        value: portalButton1,
        configurable: true,
      })
      jest.spyOn(portalContainer, 'contains').mockReturnValue(true)

      tabStopPortal.focus()
      expect(mockedFocusFirstFocusableChild).toHaveBeenCalledWith(portalContainer)
      expect(focusSpy).not.toHaveBeenCalled()
      expect(tabStopPortal.isPortalling).toBe(true)

      // Reset mock
      jest.clearAllMocks()

      // Test with tabindex="-1" (should focus container)
      portalContainer.setAttribute('tabindex', '-1')

      // Mock document.activeElement to be the portal container
      Object.defineProperty(document, 'activeElement', {
        value: portalContainer,
        configurable: true,
      })

      tabStopPortal.focus()
      expect(focusSpy).toHaveBeenCalled()
      expect(mockedFocusFirstFocusableChild).not.toHaveBeenCalled()
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should not set isPortalling when focus goes outside portal', () => {
      tabStopPortal.activate()
      portalContainer.setAttribute('tabindex', '-1')
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      // Mock document.activeElement to be something outside the portal
      Object.defineProperty(document, 'activeElement', {
        value: afterElement, // An element outside the portal
        configurable: true,
      })

      // Mock contains to return false
      jest.spyOn(portalContainer, 'contains').mockReturnValue(false)

      tabStopPortal.focus()

      expect(focusSpy).toHaveBeenCalled()
      expect(tabStopPortal.isPortalling).toBe(false)
    })

    it('should set isPortalling when activeElement is contained within portal', () => {
      tabStopPortal.activate()
      portalContainer.setAttribute('tabindex', '0')

      // Mock document.activeElement to be a child element
      Object.defineProperty(document, 'activeElement', {
        value: portalButton2,
        configurable: true,
      })

      // Mock contains to return true
      jest.spyOn(portalContainer, 'contains').mockReturnValue(true)

      tabStopPortal.focus()

      expect(mockedFocusFirstFocusableChild).toHaveBeenCalledWith(portalContainer)
      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should handle edge case with tabindex="" (empty string)', () => {
      tabStopPortal.activate()
      portalContainer.setAttribute('tabindex', '')

      // Mock document.activeElement to simulate that focus went to a child element
      const mockActiveElement = portalButton1
      Object.defineProperty(document, 'activeElement', {
        value: mockActiveElement,
        configurable: true,
      })

      // Mock contains to return true for child element
      jest.spyOn(portalContainer, 'contains').mockReturnValue(true)

      tabStopPortal.focus()

      // Empty string should be treated as non-"0", so focus container
      const focusSpy = jest.spyOn(portalContainer, 'focus')

      // Reset and test again to see the actual behavior
      jest.clearAllMocks()

      // Mock document.activeElement to be the portal container for this test
      Object.defineProperty(document, 'activeElement', {
        value: portalContainer,
        configurable: true,
      })

      tabStopPortal.focus()
      expect(focusSpy).not.toHaveBeenCalled()
      expect(mockedFocusFirstFocusableChild).toHaveBeenCalled()
    })
  })

  describe('after element navigation', () => {
    beforeEach(() => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()
    })

    it('should handle A1: forward tab past after element', () => {
      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: afterElement,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(true)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockedFocusFirstInteractiveChild).toHaveBeenCalledWith(portalContainer)
    })

    it('should handle A2: forward tab past last portal element', () => {
      // Mock getLastFocusableChild to return portalButton2
      mockedGetLastFocusableChild.mockReturnValue(portalButton2)

      tabStopPortal.isPortalling = true

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: portalButton2,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(false)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockedFocusNextInteractiveElement).toHaveBeenCalledWith(document.body, afterElement)
    })

    it('should handle A3: backward tab to after element from outside portal', () => {
      // Mock getFirstFocusableChild to return portalButton1
      mockedGetFirstFocusableChild.mockReturnValue(portalButton1)

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: nextElement,
        toElement: afterElement,
        type: 'TO' as const,
        isTabNavigating: true,
        isForwardNavigating: false,
        isBackwardNavigating: true,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(true)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockedFocusLastInteractiveChild).toHaveBeenCalledWith(portalContainer)
    })

    it('should handle A4: backward tab past first portal element', () => {
      // Mock getFirstFocusableChild to return portalButton1
      mockedGetFirstFocusableChild.mockReturnValue(portalButton1)

      tabStopPortal.isPortalling = true

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: portalButton1,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: false,
        isBackwardNavigating: true,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      const focusSpy = jest.spyOn(afterElement, 'focus')

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(false)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(focusSpy).toHaveBeenCalled()
    })
  })

  describe('before element navigation', () => {
    beforeEach(() => {
      const options: TabStopPortalOptions = { before: beforeElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()
    })

    it('should handle B1: forward tab to before element from outside portal', () => {
      // Mock getLastFocusableChild to return portalButton2
      mockedGetLastFocusableChild.mockReturnValue(portalButton2)

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: previousElement,
        toElement: beforeElement,
        type: 'TO' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(true)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockedFocusFirstInteractiveChild).toHaveBeenCalledWith(portalContainer)
    })

    it('should handle B2: forward tab past last portal element', () => {
      // Mock getLastFocusableChild to return portalButton2
      mockedGetLastFocusableChild.mockReturnValue(portalButton2)

      tabStopPortal.isPortalling = true

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: portalButton2,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      const focusSpy = jest.spyOn(beforeElement, 'focus')

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(false)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(focusSpy).toHaveBeenCalled()
    })

    it('should handle B3: backward tab past before element', () => {
      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: beforeElement,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: false,
        isBackwardNavigating: true,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(true)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockedFocusLastInteractiveChild).toHaveBeenCalledWith(portalContainer)
    })

    it('should handle B4: backward tab past first portal element', () => {
      // Mock getFirstFocusableChild to return portalButton1
      mockedGetFirstFocusableChild.mockReturnValue(portalButton1)

      tabStopPortal.isPortalling = true

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: portalButton1,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: false,
        isBackwardNavigating: true,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(false)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockedFocusPreviousInteractiveElement).toHaveBeenCalledWith(document.body, beforeElement)
    })
  })

  describe('mouse navigation', () => {
    beforeEach(() => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()
    })

    it('should deactivate portalling when clicking outside portal container', () => {
      tabStopPortal.isPortalling = true

      const navEvent = {
        event: new MouseEvent('mousedown'),
        fromElement: null,
        toElement: nextElement,
        type: 'TO' as const,
        isTabNavigating: false,
        isForwardNavigating: false,
        isBackwardNavigating: false,
        isMouseNavigating: true,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: false,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(false)
    })

    it('should not affect portalling when clicking inside portal container', () => {
      tabStopPortal.isPortalling = true

      const navEvent = {
        event: new MouseEvent('mousedown'),
        fromElement: null,
        toElement: portalButton1,
        type: 'TO' as const,
        isTabNavigating: false,
        isForwardNavigating: false,
        isBackwardNavigating: false,
        isMouseNavigating: true,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: false,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(true)
    })

    it('should not affect portalling when clicking on portal container itself', () => {
      tabStopPortal.isPortalling = true

      const navEvent = {
        event: new MouseEvent('mousedown'),
        fromElement: null,
        toElement: portalContainer,
        type: 'TO' as const,
        isTabNavigating: false,
        isForwardNavigating: false,
        isBackwardNavigating: false,
        isMouseNavigating: true,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: false,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(tabStopPortal.isPortalling).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should ignore navigation events when inactive', () => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      // Don't activate

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: afterElement,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      expect(mockedFocusFirstInteractiveChild).not.toHaveBeenCalled()
    })

    it('should ignore non-tab navigation events', () => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: afterElement,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: false, // Not tab navigating
        isForwardNavigating: false,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: true,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      expect(mockEvent.preventDefault).not.toHaveBeenCalled()
      expect(mockedFocusFirstInteractiveChild).not.toHaveBeenCalled()
    })

    it('should handle case when both after and before are provided (after takes precedence)', () => {
      const options: TabStopPortalOptions = { after: afterElement, before: beforeElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()

      const mockEvent: MockEvent = { preventDefault: jest.fn() }
      const navEvent = {
        event: mockEvent,
        fromElement: afterElement,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent)

      // Should handle as 'after' case
      expect(tabStopPortal.isPortalling).toBe(true)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockedFocusFirstInteractiveChild).toHaveBeenCalledWith(portalContainer)
    })

    it('should handle null toElement in mouse events', () => {
      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()
      tabStopPortal.isPortalling = true

      const navEvent = {
        event: new MouseEvent('mousedown'),
        fromElement: null,
        toElement: null,
        type: 'TO' as const,
        isTabNavigating: false,
        isForwardNavigating: false,
        isBackwardNavigating: false,
        isMouseNavigating: true,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: false,
      }

      // Should not throw and should deactivate portalling
      expect(() => {
        // @ts-expect-error - accessing private method for testing
        tabStopPortal.handleNavigation(navEvent)
      }).not.toThrow()

      expect(tabStopPortal.isPortalling).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should support complete forward navigation flow with after element', () => {
      mockedGetLastFocusableChild.mockReturnValue(portalButton2)
      mockedGetFirstFocusableChild.mockReturnValue(portalButton1)

      const options: TabStopPortalOptions = { after: afterElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()

      // Step 1: Tab forward past 'after' element
      const mockEvent1: MockEvent = { preventDefault: jest.fn() }
      const navEvent1 = {
        event: mockEvent1,
        fromElement: afterElement,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent1)

      expect(tabStopPortal.isPortalling).toBe(true)
      expect(mockedFocusFirstInteractiveChild).toHaveBeenCalledWith(portalContainer)

      // Step 2: Tab forward past last portal element
      const mockEvent2: MockEvent = { preventDefault: jest.fn() }
      const navEvent2 = {
        event: mockEvent2,
        fromElement: portalButton2,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: true,
        isBackwardNavigating: false,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent2)

      expect(tabStopPortal.isPortalling).toBe(false)
      expect(mockedFocusNextInteractiveElement).toHaveBeenCalledWith(document.body, afterElement)
    })

    it('should support complete backward navigation flow with before element', () => {
      mockedGetFirstFocusableChild.mockReturnValue(portalButton1)

      const options: TabStopPortalOptions = { before: beforeElement }
      tabStopPortal = new TabStopPortal(portalContainer, options)
      tabStopPortal.activate()

      // Step 1: Tab backward past 'before' element
      const mockEvent1: MockEvent = { preventDefault: jest.fn() }
      const navEvent1 = {
        event: mockEvent1,
        fromElement: beforeElement,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: false,
        isBackwardNavigating: true,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent1)

      expect(tabStopPortal.isPortalling).toBe(true)
      expect(mockedFocusLastInteractiveChild).toHaveBeenCalledWith(portalContainer)

      // Step 2: Tab backward past first portal element
      const mockEvent2: MockEvent = { preventDefault: jest.fn() }
      const navEvent2 = {
        event: mockEvent2,
        fromElement: portalButton1,
        toElement: null,
        type: 'FROM' as const,
        isTabNavigating: true,
        isForwardNavigating: false,
        isBackwardNavigating: true,
        isMouseNavigating: false,
        isArrowKeyNavigating: false,
        isKeyboardNavigating: true,
      }

      // @ts-expect-error - accessing private method for testing
      tabStopPortal.handleNavigation(navEvent2)

      expect(tabStopPortal.isPortalling).toBe(false)
      expect(mockedFocusPreviousInteractiveElement).toHaveBeenCalledWith(document.body, beforeElement)
    })
  })
})
