import { EventEmitter } from '@dreamlab.gg/core/events'

interface Events {
  onPlayerKill: []
  onPlayerDamage: []
}

export const events = new EventEmitter<Events>()
