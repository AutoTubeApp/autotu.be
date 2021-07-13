import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { IUser } from '~/types/user'

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true
})

export default class User extends VuexModule {
  public user:IUser = {
    login: undefined,
    avatar: 'dev/avatar.jpg'
  }

  @Mutation
  public updateUser (userData: IUser) {
    this.user = { ...this.user, ...userData }
  }
}
