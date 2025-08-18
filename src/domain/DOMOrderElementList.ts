import ElementList from './ElementList'
import { Elemental } from './interfaces'
import { getDOMOrder } from '../primitives/selectors'

/**
 * An ElementList that ensures the elements remain in order of appearance in the DOM.
 *
 * Note: this does not watch the DOM tree, it only updates the order when elements are added or
 * the consumer instructs the DOMOrderElementList to update.
 */
export default class DOMOrderElementList extends ElementList {
  container: Elemental

  /**
   * @param container Any parent container to observe for child DOM order. It's best to reduce the total number of elements within the container.
   * @param elements A list of Elemental to store in DOM order
   */
  constructor(container: Elemental, elements?: Iterable<Elemental> | null) {
    super(elements)

    this.container = container
  }

  /**
   * Adds an Elemental to the ElementList and updates the order.
   *
   * @param element An Elemental to add to the ElementList
   * @returns
   */
  add(element: Elemental): this {
    super.add(element)
    this.update()

    return this
  }

  /**
   * Updates the order of elements in the ElementList to match their order in the DOM.
   *
   * Automatically called anytime an element is added.
   */
  update() {
    const newElements = getDOMOrder(this.container, this)

    this.clear()
    for (const element of newElements) {
      super.add(element)
    }
  }
}
