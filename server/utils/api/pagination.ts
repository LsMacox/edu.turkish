export function calculatePagination(total: number, page: number, limit: number) {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit)
  return { total, page, limit, totalPages }
}

