import { Injectable } from '@nestjs/common'
import { PairingService, Results, type Participant } from './app.PairingService'

@Injectable()
export class AppService {
  private readonly database: Participant[] = [] // TODO: This could be some sort of data store, such as Redis/Cosmos/etc

  constructor (private readonly pairingService: PairingService) {}

  signup (info: Participant): Participant {
    this.database.push(info)

    return info
  }

  async getResults (): Promise<Results> {
    return await this.pairingService.getPairsAsync(this.database)
  }
}

export { Participant, Results }
