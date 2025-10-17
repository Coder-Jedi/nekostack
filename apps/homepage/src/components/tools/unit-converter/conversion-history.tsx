'use client'

import { History, Trash2, Clock, ArrowLeftRight, DollarSign } from 'lucide-react'

interface ConversionHistoryProps {
  history: any[]
  onClear: () => void
}

export function ConversionHistory({ history, onClear }: ConversionHistoryProps) {

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const getIcon = (type: string) => {
    return type === 'currency' ? DollarSign : ArrowLeftRight
  }

  const getTypeColor = (type: string) => {
    return type === 'currency' ? 'text-green-600' : 'text-blue-600'
  }

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <History className="h-4 w-4" />
          Conversion History
        </h3>
        <div className="text-center py-8">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No conversions yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start converting to see your history here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <History className="h-4 w-4" />
          Conversion History
          <span className="text-sm text-muted-foreground">({history.length})</span>
        </h3>
        <button
          onClick={onClear}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          title="Clear history"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
        {history.map((conversion, index) => {
          const Icon = getIcon(conversion.type)
          return (
            <div
              key={index}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded ${getTypeColor(conversion.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{conversion.from}</span>
                    <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium text-sm">{conversion.to}</span>
                  </div>
                  {conversion.rate && (
                    <div className="text-xs text-muted-foreground mb-1">
                      Rate: {conversion.rate.toFixed(4)}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTime(conversion.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {history.length === 0 && (
        <div className="text-center py-8">
          <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No conversions yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start converting to see your history here
          </p>
        </div>
      )}
    </div>
  )
}
