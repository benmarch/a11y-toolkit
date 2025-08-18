import { isFocusable, isInteractive } from '../inspectors'
import { isFocusable as tabbableIsFocusable, isTabbable } from 'tabbable'

// Mock tabbable functions
jest.mock('tabbable', () => ({
  isFocusable: jest.fn(),
  isTabbable: jest.fn(),
}))

const mockTabbableIsFocusable = tabbableIsFocusable as jest.MockedFunction<typeof tabbableIsFocusable>
const mockIsTabbable = isTabbable as jest.MockedFunction<typeof isTabbable>

describe('inspectors', () => {
  let element: HTMLElement
  let nonElement: EventTarget

  beforeEach(() => {
    element = document.createElement('button')
    nonElement = new EventTarget()

    mockTabbableIsFocusable.mockClear()
    mockIsTabbable.mockClear()
  })

  describe('isFocusable', () => {
    it('should return true when element is focusable according to tabbable', () => {
      mockTabbableIsFocusable.mockReturnValue(true)

      const result = isFocusable(element)

      expect(result).toBe(true)
      expect(mockTabbableIsFocusable).toHaveBeenCalledWith(element)
    })

    it('should return false when element is not focusable according to tabbable', () => {
      mockTabbableIsFocusable.mockReturnValue(false)

      const result = isFocusable(element)

      expect(result).toBe(false)
      expect(mockTabbableIsFocusable).toHaveBeenCalledWith(element)
    })

    it('should return false when passed non-Element object', () => {
      const result = isFocusable(nonElement)

      expect(result).toBe(false)
      expect(mockTabbableIsFocusable).not.toHaveBeenCalled()
    })

    it('should return false when passed null', () => {
      const result = isFocusable(null as unknown as Element)

      expect(result).toBe(false)
      expect(mockTabbableIsFocusable).not.toHaveBeenCalled()
    })

    it('should return false when passed undefined', () => {
      const result = isFocusable(undefined as unknown as Element)

      expect(result).toBe(false)
      expect(mockTabbableIsFocusable).not.toHaveBeenCalled()
    })

    it('should work with different Element types', () => {
      const input = document.createElement('input')
      const div = document.createElement('div')
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

      mockTabbableIsFocusable.mockReturnValue(true)

      expect(isFocusable(input)).toBe(true)
      expect(isFocusable(div)).toBe(true)
      expect(isFocusable(svg)).toBe(true)

      expect(mockTabbableIsFocusable).toHaveBeenCalledTimes(3)
      expect(mockTabbableIsFocusable).toHaveBeenCalledWith(input)
      expect(mockTabbableIsFocusable).toHaveBeenCalledWith(div)
      expect(mockTabbableIsFocusable).toHaveBeenCalledWith(svg)
    })
  })

  describe('isInteractive', () => {
    it('should return true when element is tabbable according to tabbable library', () => {
      mockIsTabbable.mockReturnValue(true)

      const result = isInteractive(element)

      expect(result).toBe(true)
      expect(mockIsTabbable).toHaveBeenCalledWith(element)
    })

    it('should return false when element is not tabbable according to tabbable library', () => {
      mockIsTabbable.mockReturnValue(false)

      const result = isInteractive(element)

      expect(result).toBe(false)
      expect(mockIsTabbable).toHaveBeenCalledWith(element)
    })

    it('should return false when passed non-Element object', () => {
      const result = isInteractive(nonElement)

      expect(result).toBe(false)
      expect(mockIsTabbable).not.toHaveBeenCalled()
    })

    it('should return false when passed null', () => {
      const result = isInteractive(null as unknown as Element)

      expect(result).toBe(false)
      expect(mockIsTabbable).not.toHaveBeenCalled()
    })

    it('should return false when passed undefined', () => {
      const result = isInteractive(undefined as unknown as Element)

      expect(result).toBe(false)
      expect(mockIsTabbable).not.toHaveBeenCalled()
    })

    it('should work with different Element types', () => {
      const button = document.createElement('button')
      const link = document.createElement('a')
      const select = document.createElement('select')

      mockIsTabbable.mockReturnValue(true)

      expect(isInteractive(button)).toBe(true)
      expect(isInteractive(link)).toBe(true)
      expect(isInteractive(select)).toBe(true)

      expect(mockIsTabbable).toHaveBeenCalledTimes(3)
      expect(mockIsTabbable).toHaveBeenCalledWith(button)
      expect(mockIsTabbable).toHaveBeenCalledWith(link)
      expect(mockIsTabbable).toHaveBeenCalledWith(select)
    })
  })

  describe('integration behavior', () => {
    it('should distinguish between focusable and interactive elements', () => {
      // An element can be focusable but not interactive (e.g., div with tabindex)
      mockTabbableIsFocusable.mockReturnValue(true)
      mockIsTabbable.mockReturnValue(false)

      expect(isFocusable(element)).toBe(true)
      expect(isInteractive(element)).toBe(false)
    })

    it('should handle element being both focusable and interactive', () => {
      // Most interactive elements are also focusable
      mockTabbableIsFocusable.mockReturnValue(true)
      mockIsTabbable.mockReturnValue(true)

      expect(isFocusable(element)).toBe(true)
      expect(isInteractive(element)).toBe(true)
    })
  })
})
