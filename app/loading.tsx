export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-green-800 mb-2 font-montserrat">Earthy Aromas</h2>
        <p className="text-green-600">Loading your store...</p>
      </div>
    </div>
  )
}
