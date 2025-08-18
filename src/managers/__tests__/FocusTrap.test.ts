import FocusTrap from '../FocusTrap'
import { createFocusTrap } from 'focus-trap'

// Mock focus-trap module
jest.mock('focus-trap', () => ({
  createFocusTrap: jest.fn(() => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
  })),
}))

const mockCreateFocusTrap = createFocusTrap as jest.MockedFunction<typeof createFocusTrap>

describe('FocusTrap', () => {
  let container: HTMLElement
  let focusTrap: FocusTrap
  let mockTrap: { activate: jest.Mock; deactivate: jest.Mock }

  beforeEach(() => {
    container = document.createElement('div')
    mockTrap = {
      activate: jest.fn(),
      deactivate: jest.fn(),
    }

    mockCreateFocusTrap.mockReturnValue(mockTrap as unknown as ReturnType<typeof createFocusTrap>)
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create FocusTrap with default options', () => {
      focusTrap = new FocusTrap(container)

      expect(focusTrap.container).toBe(container)
      expect(focusTrap.isActive).toBe(false)
      expect(mockCreateFocusTrap).toHaveBeenCalledWith(container, {
        escapeDeactivates: false,
        clickOutsideDeactivates: false,
        returnFocusOnDeactivate: false,
      })
      expect(focusTrap.trap).toBe(mockTrap)
    })

    it('should create FocusTrap with isActive option', () => {
      focusTrap = new FocusTrap(container, { isActive: true })

      expect(focusTrap.isActive).toBe(true)
      expect(mockTrap.activate).toHaveBeenCalledTimes(1)
    })

    it('should throw error when container is not provided', () => {
      expect(() => {
        new FocusTrap(null as unknown as HTMLElement)
      }).toThrow('Container Element not provided')
    })

    it('should throw error when container is undefined', () => {
      expect(() => {
        new FocusTrap(undefined as unknown as HTMLElement)
      }).toThrow('Container Element not provided')
    })

    it('should work with different element types', () => {
      const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

      focusTrap = new FocusTrap(svgContainer)

      expect(focusTrap.container).toBe(svgContainer)
      expect(mockCreateFocusTrap).toHaveBeenCalledWith(svgContainer, expect.any(Object))
    })

    it('should handle EventTarget container', () => {
      const eventTarget = new EventTarget()

      focusTrap = new FocusTrap(eventTarget)

      expect(focusTrap.container).toBe(eventTarget)
      expect(mockCreateFocusTrap).toHaveBeenCalledWith(eventTarget, expect.any(Object))
    })

    it('should pass correct options to createFocusTrap', () => {
      focusTrap = new FocusTrap(container)

      expect(mockCreateFocusTrap).toHaveBeenCalledWith(container, {
        escapeDeactivates: false,
        clickOutsideDeactivates: false,
        returnFocusOnDeactivate: false,
      })
    })
  })

  describe('activate', () => {
    beforeEach(() => {
      focusTrap = new FocusTrap(container)
    })

    it('should set isActive to true', () => {
      focusTrap.activate()

      expect(focusTrap.isActive).toBe(true)
    })

    it('should call trap.activate()', () => {
      focusTrap.activate()

      expect(mockTrap.activate).toHaveBeenCalledTimes(1)
    })

    it('should work when already active', () => {
      focusTrap.isActive = true

      focusTrap.activate()

      expect(focusTrap.isActive).toBe(true)
      expect(mockTrap.activate).toHaveBeenCalledTimes(1)
    })

    it('should handle activation errors gracefully', () => {
      mockTrap.activate.mockImplementation(() => {
        throw new Error('Activation failed')
      })

      expect(() => focusTrap.activate()).toThrow('Activation failed')
      expect(focusTrap.isActive).toBe(true) // Should still be set to true
    })
  })

  describe('deactivate', () => {
    beforeEach(() => {
      focusTrap = new FocusTrap(container, { isActive: true })
      jest.clearAllMocks() // Clear the activate call from constructor
    })

    it('should set isActive to false', () => {
      focusTrap.deactivate()

      expect(focusTrap.isActive).toBe(false)
    })

    it('should call trap.deactivate()', () => {
      focusTrap.deactivate()

      expect(mockTrap.deactivate).toHaveBeenCalledTimes(1)
    })

    it('should work when already inactive', () => {
      focusTrap.isActive = false

      focusTrap.deactivate()

      expect(focusTrap.isActive).toBe(false)
      expect(mockTrap.deactivate).toHaveBeenCalledTimes(1)
    })

    it('should handle deactivation errors gracefully', () => {
      mockTrap.deactivate.mockImplementation(() => {
        throw new Error('Deactivation failed')
      })

      expect(() => focusTrap.deactivate()).toThrow('Deactivation failed')
      expect(focusTrap.isActive).toBe(false) // Should still be set to false
    })
  })

  describe('integration scenarios', () => {
    beforeEach(() => {
      focusTrap = new FocusTrap(container)
    })

    it('should support complete activate/deactivate cycle', () => {
      // Initially inactive
      expect(focusTrap.isActive).toBe(false)

      // Activate
      focusTrap.activate()
      expect(focusTrap.isActive).toBe(true)
      expect(mockTrap.activate).toHaveBeenCalledTimes(1)

      // Deactivate
      focusTrap.deactivate()
      expect(focusTrap.isActive).toBe(false)
      expect(mockTrap.deactivate).toHaveBeenCalledTimes(1)
    })

    it('should support multiple activations and deactivations', () => {
      focusTrap.activate()
      focusTrap.activate()
      focusTrap.activate()

      expect(mockTrap.activate).toHaveBeenCalledTimes(3)
      expect(focusTrap.isActive).toBe(true)

      focusTrap.deactivate()
      focusTrap.deactivate()

      expect(mockTrap.deactivate).toHaveBeenCalledTimes(2)
      expect(focusTrap.isActive).toBe(false)
    })

    it('should maintain state consistency', () => {
      // Test state changes
      expect(focusTrap.isActive).toBe(false)

      focusTrap.activate()
      expect(focusTrap.isActive).toBe(true)

      focusTrap.deactivate()
      expect(focusTrap.isActive).toBe(false)

      focusTrap.activate()
      expect(focusTrap.isActive).toBe(true)
    })

    it('should work with different container configurations', () => {
      const button = document.createElement('button')
      const div = document.createElement('div')
      div.appendChild(button)

      const trapWithContent = new FocusTrap(div)

      expect(trapWithContent.container).toBe(div)
      expect(mockCreateFocusTrap).toHaveBeenCalledWith(div, expect.any(Object))

      trapWithContent.activate()
      expect(trapWithContent.isActive).toBe(true)

      trapWithContent.deactivate()
      expect(trapWithContent.isActive).toBe(false)
    })
  })

  describe('focus-trap library integration', () => {
    beforeEach(() => {
      focusTrap = new FocusTrap(container)
    })

    it('should pass container as HTMLElement to createFocusTrap', () => {
      expect(mockCreateFocusTrap).toHaveBeenCalledWith(
        container,
        expect.objectContaining({
          escapeDeactivates: false,
          clickOutsideDeactivates: false,
          returnFocusOnDeactivate: false,
        }),
      )
    })

    it('should store the trap instance correctly', () => {
      expect(focusTrap.trap).toBe(mockTrap)
    })

    it('should delegate activate calls to the trap', () => {
      focusTrap.activate()

      expect(mockTrap.activate).toHaveBeenCalledWith()
    })

    it('should delegate deactivate calls to the trap', () => {
      focusTrap.deactivate()

      expect(mockTrap.deactivate).toHaveBeenCalledWith()
    })
  })

  describe('options handling', () => {
    it('should handle empty options object', () => {
      focusTrap = new FocusTrap(container, {})

      expect(focusTrap.isActive).toBe(false)
      expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1)
    })

    it('should handle undefined options', () => {
      focusTrap = new FocusTrap(container, undefined)

      expect(focusTrap.isActive).toBe(false)
      expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1)
    })

    it('should handle options with only isActive false', () => {
      focusTrap = new FocusTrap(container, { isActive: false })

      expect(focusTrap.isActive).toBe(false)
      expect(mockTrap.activate).not.toHaveBeenCalled()
    })
  })
})
