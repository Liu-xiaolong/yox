import execute from '../../../yox-common/src/function/execute'
import debounce from '../../../yox-common/src/function/debounce'

import * as env from '../../../yox-common/src/util/env'

import api from '../../../yox-dom/src/dom'

import * as type from '../../../yox-type/src/type'

import Yox from '../../../yox-type/src/interface/Yox'
import VNode from '../../../yox-type/src/vnode/VNode'
import Directive from '../../../yox-type/src/vnode/Directive'
import DirectiveHooks from '../../../yox-type/src/hooks/Directive'

const directive: DirectiveHooks = {
  bind(node: HTMLElement | Yox, directive: Directive, vnode: VNode) {

    let { name, handler } = directive, { lazy } = vnode

    if (!handler) {
      return
    }

    if (lazy) {

      const value = lazy[name] || lazy[env.EMPTY_STRING]

      if (value === env.TRUE) {
        name = env.EVENT_CHANGE
      }
      else if (value > 0) {
        handler = debounce(
          handler,
          value,
          // 避免连续多次点击，主要用于提交表单场景
          // 移动端的 tap 事件可自行在业务层打补丁实现
          name === env.EVENT_CLICK || name === env.EVENT_TAP
        )
      }

    }

    if (vnode.isComponent) {

      (node as Yox).on(name, handler)
      vnode.data[directive.key] = function () {
        (node as Yox).off(name, handler as type.listener)
      }

    }
    else {

      api.on(node as HTMLElement, name, handler)
      vnode.data[directive.key] = function () {
        api.off(node as HTMLElement, name, handler as type.listener)
      }

    }

  },

  unbind(node: HTMLElement | Yox, directive: Directive, vnode: VNode) {
    execute(vnode.data[directive.key])
  }
}

export default directive
