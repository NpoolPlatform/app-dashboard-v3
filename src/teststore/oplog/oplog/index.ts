import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetAppOpLogsRequest,
  GetAppOpLogsResponse,
  OpLog
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useAdminOpLogStore = defineStore('admin-oplog-v4', {
  state: () => ({
    OpLogs: {
      OpLogs: [] as Array<OpLog>,
      Total: 0
    }
  }),
  getters: {},
  actions: {
    getAppOpLogs (req: GetAppOpLogsRequest, done: (error: boolean, rows: Array<OpLog>) => void) {
      doActionWithError<GetAppOpLogsRequest, GetAppOpLogsResponse>(
        API.GET_OP_LOGS,
        req,
        req.Message,
        (resp: GetAppOpLogsResponse): void => {
          this.OpLogs.OpLogs.push(...resp.Infos)
          this.OpLogs.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<OpLog>)
        }
      )
    }
  }
})
