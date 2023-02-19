import { Controller, Body, Get, Post } from '@nestjs/common'
import { Participant, type Results } from './app.PairingService'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Post('signup')
  signup (@Body() signup: Participant): Participant {
    return this.appService.signup(signup)
  }

  @Get('results')
  async results (): Promise<Results> {
    return await this.appService.getResults()
  }
}
