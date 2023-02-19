import { Injectable } from '@nestjs/common'

export class Results {
  score: number
  pairs: Pairing[]
}

export class Participant {
  name: string
  team: number
}

export class Pairing {
  pair1: Participant
  pair2: Participant
  pair3?: Participant

  constructor (pair1: Participant, pair2: Participant, pair3?: Participant) {
    this.pair1 = pair1
    this.pair2 = pair2
    this.pair3 = pair3
  }

  getPair (item: number): Participant | undefined {
    if (item === 0) {
      return this.pair1
    } else if (item === 1) {
      return this.pair2
    }

    return this.pair3
  }

  get Count (): number {
    return this.pair3 !== undefined ? 3 : 2
  }

  get Score (): number {
    let score = 0
    const first = this.pair1
    const second = this.pair2
    const third = this.pair3

    const sameTeam = first.team === second.team || first.team === third?.team || second.team === third?.team

    if (sameTeam) { // If any are on the same team, penalize 2 points
      score += 2
    }

    return score
  }
}

@Injectable()
export class PairingService {
  private getRandom (min: number, max: number): number {
    return Math.floor(Math.random() * max)
  }

  private getLabel (index: number): string {
    return (index === 0)
      ? 'pair1'
      : index === 1
        ? 'pair2'
        : 'pair3'
  }

  /**
   * Main entry point into the pairing service.  This will return an optimal set of lunch pairs based on given participants
   * @param participants An array of lunch participants
   * @returns An optimal set of pair pairs, as well as a score for the set (lower the better)
   */
  async getPairsAsync (participants: Participant[]): Promise<Results> {
    let temperature = 10000.0
    const absoluteTemperature = 0.00001
    const COOLING_RATE = 0.9999

    const p = new Promise<Results>((resolve, _reject) => {
      setTimeout(() => {
        // If there's no participants, no reason to do any of this nonsense
        if (participants.length === 0) {
          resolve({ pairs: [], score: 0 })
          return
        }

        // If there's three or less people, the only option is to return a single pair with everyone
        if (participants.length <= 3) {
          // Score is technically zero because this can be proven to be the most optimal solution
          resolve({ pairs: [new Pairing(participants[0], participants[1], participants[2])], score: 0 })
          return
        }
        
        let currentSet: Pairing[] = this.getRandomPairs(participants)
        let score = this.getScore(currentSet)
        
        while (temperature > absoluteTemperature) {
          const nextSet: Pairing[] = this.getNextSet(currentSet)
          const deltaScore = this.getScore(nextSet) - score
    
          // if the new set has a smaller score (good thing)
          // or if the new set has a higher score but satisfies Boltzman condition then accept the set
          if ((deltaScore < 0) || (score > 0 && Math.exp(-deltaScore / temperature) > Math.random())) {
            currentSet = nextSet
            score += deltaScore
          }
    
          // cool down the temperature
          temperature *= COOLING_RATE
        }

        resolve({ pairs: currentSet, score })
      }, 0)
    })

    return await p
  }

  /**
   * Takes an array of pairings and swaps a random person with another
   * @param pairings An array of pairings
   * @returns A new array, but with a random person swapped with another random person
   */
  private getNextSet (pairings: Pairing[]): Pairing[] {
    // Make a copy of the current set
    const nextSet: Pairing[] = []
    pairings.forEach(val => nextSet.push(new Pairing(val.pair1, val.pair2, val.pair3)))

    // If there's only one pairing, just return that pairing since there's no way to improve that score
    if (pairings.length === 1) {
      return pairings
    }

    // Swap one participant with another at random
    const pair1: number = this.getRandom(0, nextSet.length)
    let pair2: number
    
    while (true) {
      pair2 = this.getRandom(0, nextSet.length)
      if (pair1 !== pair2) {
        break
      }
    }

    // Swap a random participant in pair1 with a random participant in pair2
    const p1: Pairing = nextSet[pair1]
    const p2: Pairing = nextSet[pair2]

    const fromPair: string = this.getLabel(this.getRandom(0, p1.Count))
    const toPair: string = this.getLabel(this.getRandom(0, p2.Count))

    const from = p1[fromPair]
    const to = p2[toPair]

    p1[fromPair] = to
    p2[toPair] = from

    return nextSet
  }

  /**
   * Returns a random array of lunch pairs using the provided participants
   * @param participants An array of people who have signed up for random lunch
   * @returns An array of pairs randomly assigned.  If an odd number of participants was given, one set will have three people
   */
  private getRandomPairs (participants: Participant[]): Pairing[] {
    participants.sort(() => Math.random())
    const stack: Participant[] = [...participants]
    const ret: Pairing[] = []

    while (stack.length > 1) {
      const val1 = stack.pop() ?? (() => { throw new Error('No item found on stack') })()
      const val2 = stack.pop() ?? (() => { throw new Error('No item found on stack') })()

      const curPairing: Pairing = new Pairing(val1, val2)

      if (stack.length === 1) {
        curPairing.pair3 = stack.pop()
      }

      ret.push(curPairing)
    }

    return ret
  }

  /**
   * Gets the total score for a given array of pairs
   * @param currentSet An array of lunch pairs
   * @returns The total score for the set, zero being perfect
   */
  private getScore (currentSet: Pairing[]): number {
    return currentSet.reduce((sum, current) => sum + current.Score, 0)
  }
}
