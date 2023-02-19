import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PairingService } from './app.PairingService'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PairingService]
})

export class AppModule {}
