import type { RouteRecordNormalized } from 'vue-router'
import { useRouter } from 'vue-router'

/**
 * 检查是否是 HTTP URL
 */
function isHttpUrl(url: string): boolean {
  // eslint-disable-next-line e18e/prefer-static-regex
  return /^https?:\/\//.test(url)
}

/**
 * 打开新窗口
 */
function openWindow(
  url: string,
  options: { target?: string, features?: string } = {},
) {
  const { target = '_blank', features = '' } = options
  window.open(url, target, features)
}

/**
 * 在新窗口中打开路由
 */
function openRouteInNewWindow(href: string) {
  openWindow(href, { target: '_blank' })
}

function useNavigation() {
  const router = useRouter()
  const routeMetaMap = new Map<string, RouteRecordNormalized>()

  // 初始化路由映射
  const initRouteMetaMap = () => {
    const routes = router.getRoutes()
    routes.forEach((route) => {
      routeMetaMap.set(route.path, route)
    })
  }

  initRouteMetaMap()

  // 监听路由变化
  router.afterEach(() => {
    initRouteMetaMap()
  })

  // 检查是否应该在新窗口打开
  const shouldOpenInNewWindow = (path: string): boolean => {
    if (isHttpUrl(path)) {
      return true
    }
    const route = routeMetaMap.get(path)
    // 如果有外链或者设置了在新窗口打开，返回 true
    return !!(route?.meta?.link || route?.meta?.openInNewWindow)
  }

  const resolveHref = (path: string): string => {
    return router.resolve(path).href
  }

  const navigation = async (path: string) => {
    try {
      const route = routeMetaMap.get(path)
      const { openInNewWindow = false, query = {}, link } = route?.meta ?? {}

      // 检查是否有外链
      if (link && typeof link === 'string') {
        openWindow(link, { target: '_blank' })
        return
      }

      if (isHttpUrl(path)) {
        openWindow(path, { target: '_blank' })
      }
      else if (openInNewWindow) {
        openRouteInNewWindow(resolveHref(path))
      }
      else {
        await router.push({
          path,
          query: query as Record<string, string>,
        })
      }
    }
    catch (error) {
      console.error('Navigation failed:', error)
      throw error
    }
  }

  const willOpenedByWindow = (path: string) => {
    return shouldOpenInNewWindow(path)
  }

  return { navigation, willOpenedByWindow }
}

export { isHttpUrl, openRouteInNewWindow, openWindow, useNavigation }
