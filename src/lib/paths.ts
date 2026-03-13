const BASE_PATH = import.meta.env.BASE_URL
const NORMALIZED_BASE_PATH = BASE_PATH === '/' ? '/' : BASE_PATH.endsWith('/') ? BASE_PATH : `${BASE_PATH}/`

const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i

export const withBasePath = (path: string) => {
  if (
    !path ||
    path === BASE_PATH ||
    path === NORMALIZED_BASE_PATH ||
    ABSOLUTE_URL_PATTERN.test(path) ||
    path.startsWith('#')
  ) {
    return path
  }

  if (!path.startsWith('/')) {
    return path
  }

  if (NORMALIZED_BASE_PATH !== '/' && path.startsWith(NORMALIZED_BASE_PATH)) {
    return path
  }

  if (path === '/') {
    return NORMALIZED_BASE_PATH
  }

  return `${NORMALIZED_BASE_PATH}${path.slice(1)}`
}

export const stripBasePath = (pathname: string) => {
  if (!pathname || NORMALIZED_BASE_PATH === '/') {
    return pathname || '/'
  }

  const normalizedBasePath = NORMALIZED_BASE_PATH.endsWith('/')
    ? NORMALIZED_BASE_PATH.slice(0, -1)
    : NORMALIZED_BASE_PATH

  if (pathname === normalizedBasePath || pathname === `${normalizedBasePath}/`) {
    return '/'
  }

  if (pathname.startsWith(normalizedBasePath)) {
    const strippedPath = pathname.slice(normalizedBasePath.length)
    return strippedPath || '/'
  }

  return pathname
}
