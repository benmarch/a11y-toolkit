import ElementList from './ElementList'
import { Elemental } from './interfaces'
import { getDOMOrder } from '../primitives/selectors'

export default class DOMOrderElementList extends ElementList {
  container: Elemental

  constructor(container: Elemental, elements?: Iterable<Elemental> | null) {
    super(elements)

    this.container = container
  }

  add(element: Elemental): this {
    super.add(element)
    this.update()

    return this
  }

  update() {
    const newElements = getDOMOrder(this.container, this)

    this.clear()
    for (const element of newElements) {
      super.add(element)
    }
  }
}
