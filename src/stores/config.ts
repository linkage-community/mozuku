import { observable, computed, action } from 'mobx'

class ConfigStore {
  @observable kvs: Map<string, any> = new Map()
}
const configStore = new ConfigStore
export default configStore
