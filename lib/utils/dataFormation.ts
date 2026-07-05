export const getRelativeDate = (date: Date) => {
  const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  return new Date(date).toLocaleDateString("en-EN", { month: "short", day: "numeric", year: "numeric" })
}

export const formatDuration = (seconds: number | null) => {
  if (!seconds) return "—"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}