
import Node from './Node'

import * as nodeType from '../nodeType'

import * as env from '../../config/env'
import * as object from '../../util/object'

/**
 * 指令节点
 *
 * @param {string} name 指令名
 */
export default class Directive extends Node {

  constructor(name) {
    super(nodeType.DIRECTIVE)
    this.name = name
  }

  render(data) {

    let node = new Directive(this.name)
    node.keypath = data.keys.join('.')
    data.parent.addDirective(node)

    this.renderChildren(
      object.extend({ }, data, { parent: node })
    )

    let { children } = node
    delete node.children

    node.value = children.length > 0
      ? children[0].content
      : env.TRUE

  }

}
