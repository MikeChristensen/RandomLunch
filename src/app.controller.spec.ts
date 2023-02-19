import { Test, type TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { PairingService } from './app.PairingService'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, PairingService]
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('Testing Signup Cases', () => {
    test('Signup should return the participant', () => {
      const result = appController.signup({ name: 'Mike', team: 1 })
      expect(result.name).toBe('Mike')
      expect(result.team).toBe(1)
    })
  })

  describe('Testing Various Result Cases', () => {
    // It's impossible to pair up five people when four are on the same team
    test('impossible scenario returns score above zero', async () => {
      appController.signup({ name: 'One', team: 1 })
      appController.signup({ name: 'Two', team: 1 })
      appController.signup({ name: 'Three', team: 1 })
      appController.signup({ name: 'Four', team: 1 })
      appController.signup({ name: 'Five', team: 2 })

      const result = await appController.results()
      expect(result.score).toBeGreaterThan(0)
    })

    // With four people, two from each team, there should be an optimal pairing
    test('Optimal scenario has score of zero', async () => {
      appController.signup({ name: 'One', team: 1 })
      appController.signup({ name: 'Two', team: 1 })
      appController.signup({ name: 'Three', team: 2 })
      appController.signup({ name: 'Four', team: 2 })

      const result = await appController.results()
      expect(result.score).toBe(0)
    })
  })

  describe('Testing Result Edge Cases', () => {
    // If no one has signed up, results should just return an empty set
    test('No one signed up', async () => {
      const result = await appController.results()
      expect(result.pairs.length).toBe(0)
      expect(result.score).toBe(0)
    })

    // If one person signed up, they eat lunch alone
    test('One person signed up', async () => {
      appController.signup({ name: 'One', team: 1 })

      const result = await appController.results()
      expect(result.pairs.length).toBe(1)
      expect(result.score).toBe(0)
    })

    // If two people signed up, they're paired together
    test('Two people signed up', async () => {
      appController.signup({ name: 'One', team: 1 })
      appController.signup({ name: 'Two', team: 2 })

      const result = await appController.results()
      expect(result.pairs.length).toBe(1)
      expect(result.pairs[0].pair3).toBeUndefined()
      expect(result.score).toBe(0)
    })

    // If three people signed up, all three are paired together
    test('Three people signed up', async () => {
      appController.signup({ name: 'One', team: 1 })
      appController.signup({ name: 'Two', team: 1 })
      appController.signup({ name: 'Three', team: 2 })

      const result = await appController.results()
      expect(result.pairs.length).toBe(1)
      expect(result.pairs[0].pair3).toBeDefined()
      expect(result.score).toBe(0)
    })
  })
})
