import { Action, Module, VuexModule, Mutation } from 'vuex-module-decorators'

export interface SnackbarProps {
  visible?: boolean
  text?: string
  color?: string
}

@Module({
  stateFactory: true,
  namespaced: true
})
export default class SnackbarStore extends VuexModule {
  public sbProps: SnackbarProps = {
    visible: false
  }

  @Mutation
  public updateSnackbar (props: SnackbarProps): void {
    this.sbProps = { ...this.sbProps, ...props }
  }

  // show snackbar
  @Action
  public showSnackbar (payload: { color: string, text: string }): void {
    this.context.commit('updateSnackbar', {
      text: payload.text,
      color: payload.color ?? 'blue darken-1',
      visible: true
    })
    // timeout
    setTimeout(() => this.context.commit('updateSnackbar', {
      visible: false
    }), 5000)
  }

  // hide snackbar
  @Action
  public hideSnackbar (): void {
    this.context.commit('updateSnackbar', { visible: false })
  }
}
