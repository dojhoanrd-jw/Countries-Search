import { ref, computed, watch } from 'vue'

export interface PaginationOptions {
  itemsPerPage?: number
  maxVisiblePages?: number
}

export function usePagination<T>(
  items: () => T[],
  options: PaginationOptions = {}
) {
  const {
    itemsPerPage: defaultItemsPerPage = 12,
    maxVisiblePages = 5
  } = options

  const currentPage = ref(1)
  const itemsPerPage = ref(defaultItemsPerPage)

  // Total pages
  const totalPages = computed(() => {
    return Math.ceil(items().length / itemsPerPage.value)
  })

  // Start and end indices
  const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value
  })

  const endIndex = computed(() => {
    return Math.min(startIndex.value + itemsPerPage.value, items().length)
  })

  // Paginated items
  const paginatedItems = computed(() => {
    return items().slice(startIndex.value, endIndex.value)
  })

  // Visible page numbers
  const visiblePages = computed(() => {
    const pages: number[] = []
    const total = totalPages.value
    const current = currentPage.value
    const max = maxVisiblePages

    if (total <= max) {
      // Show all pages
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Smart pagination
      const half = Math.floor(max / 2)
      let start = Math.max(1, current - half)
      let end = Math.min(total, start + max - 1)

      if (end - start < max - 1) {
        start = Math.max(1, end - max + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  })

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const nextPage = () => {
    goToPage(currentPage.value + 1)
  }

  const prevPage = () => {
    goToPage(currentPage.value - 1)
  }

  const goToFirstPage = () => {
    goToPage(1)
  }

  const goToLastPage = () => {
    goToPage(totalPages.value)
  }

  // Reset to first page when items change
  watch([() => items().length, itemsPerPage], () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1
    }
  })

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedItems,
    visiblePages,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
  }
}
