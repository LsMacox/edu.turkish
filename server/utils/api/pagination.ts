export function calculatePagination(total: number, page: number, limit: number) {
  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 1
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const totalPages = Math.ceil(safeTotal / safeLimit)

  return {
    total: safeTotal,
    page: Math.max(1, safePage),
    limit: Math.max(1, safeLimit),
    totalPages: Math.max(1, totalPages),
  }
}
