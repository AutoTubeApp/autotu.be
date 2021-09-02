import { Action, Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { snackbarProps } from '@/components/Snackbar.vue'

@Module({
  stateFactory: true,
  namespaced: true
})

export default class SnackbarStore extends VuexModule {
  public sbProps: snackbarProps = {
    visible: false,
    text: '',
    color: 'success'
  }

  @Mutation
  public updateSnackbar (props: snackbarProps): void {
    this.sbProps = { ...this.sbProps, ...props }
  }

  // show snackbar
  @Action({ rawError: true })
  public showSnackbar (text: string, color: string = 'success'): void {
    this.context.commit('updateSnackbar', {
      text,
      color,
      visible: true
    })
    // timeout
    setTimeout(() => this.context.commit('updateSnackbar', { visible: false }), 5000)
  }
}
