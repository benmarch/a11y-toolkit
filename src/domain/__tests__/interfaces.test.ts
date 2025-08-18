import { Elemental, FocusableElement } from '../interfaces'

describe('interfaces', () => {
  describe('Elemental type', () => {
    it('should accept EventTarget', () => {
      const eventTarget: EventTarget = new EventTarget()
      const elemental: Elemental = eventTarget
      expect(elemental).toBe(eventTarget)
    })

    it('should accept Element', () => {
      const element: Element = document.createElement('div')
      const elemental: Elemental = element
      expect(elemental).toBe(element)
    })

    it('should accept HTMLElement', () => {
      const htmlElement: HTMLElement = document.createElement('button')
      const elemental: Elemental = htmlElement
      expect(elemental).toBe(htmlElement)
    })

    it('should accept SVGElement', () => {
      const svgElement: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const elemental: Elemental = svgElement
      expect(elemental).toBe(svgElement)
    })
  })

  describe('FocusableElement type', () => {
    it('should accept HTMLElement', () => {
      const htmlElement: HTMLElement = document.createElement('input')
      const focusableElement: FocusableElement = htmlElement
      expect(focusableElement).toBe(htmlElement)
    })

    it('should accept SVGElement', () => {
      const svgElement: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      const focusableElement: FocusableElement = svgElement
      expect(focusableElement).toBe(svgElement)
    })
  })

  describe('type compatibility', () => {
    it('should allow FocusableElement to be assigned to Elemental', () => {
      const htmlElement: HTMLElement = document.createElement('div')
      const focusableElement: FocusableElement = htmlElement
      const elemental: Elemental = focusableElement
      expect(elemental).toBe(htmlElement)
    })
  })
})
