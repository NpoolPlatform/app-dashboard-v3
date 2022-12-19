import { defineStore } from 'pinia'
import { API } from './const'
import {
  GetMessagesRequest,
  GetMessagesResponse,
  Message,
  CreateMessageRequest,
  CreateMessageResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  UpdateMessageRequest,
  UpdateMessageResponse,
  CreateMessagesRequest,
  CreateMessagesResponse
} from './types'
import { doActionWithError } from 'npool-cli-v4'

export const useAdminMessageStore = defineStore('admin-message-v4', {
  state: () => ({
    Messages: {
      Messages: [] as Array<Message>,
      Total: 0
    }
  }),
  getters: {
  },
  actions: {
    getMessages (req: GetMessagesRequest, done: (error: boolean, rows: Array<Message>) => void) {
      doActionWithError<GetMessagesRequest, GetMessagesResponse>(
        API.GET_MESSAGES,
        req,
        req.NotifyMessage,
        (resp: GetMessagesResponse): void => {
          this.Messages.Messages.push(...resp.Infos)
          this.Messages.Total = resp.Total
          done(false, resp.Infos)
        }, () => {
          done(true, [])
        }
      )
    },
    deleteMessage (req: DeleteMessageRequest, done: (error: boolean, row: Message) => void) {
      doActionWithError<DeleteMessageRequest, DeleteMessageResponse>(
        API.DELETE_MESSAGE,
        req,
        req.NotifyMessage,
        (resp: DeleteMessageResponse): void => {
          const index = this.Messages.Messages.findIndex((el) => el.ID === resp.Info.ID)
          this.Messages.Messages.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          this.Messages.Total -= 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as Message)
        }
      )
    },
    createMessage (req: CreateMessageRequest, done: (error: boolean, row: Message) => void) {
      doActionWithError<CreateMessageRequest, CreateMessageResponse>(
        API.CREATE_MESSAGE,
        req,
        req.NotifyMessage,
        (resp: CreateMessageResponse): void => {
          this.Messages.Messages.push(resp.Info)
          this.Messages.Total += 1
          done(false, resp.Info)
        }, () => {
          done(true, {} as Message)
        }
      )
    },
    createMessages (req: CreateMessagesRequest, done: (error: boolean, rows: Array<Message>) => void) {
      doActionWithError<CreateMessagesRequest, CreateMessagesResponse>(
        API.CREATE_MESSAGES,
        req,
        req.NotifyMessage,
        (resp: CreateMessagesResponse): void => {
          resp.Infos.forEach((el) => {
            const index = this.Messages.Messages.findIndex((al) => al.ID === el.ID)
            this.Messages.Messages.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, el)
          })
          done(false, resp.Infos)
        }, () => {
          done(true, [] as Array<Message>)
        }
      )
    },
    updateMessage (req: UpdateMessageRequest, done: (error: boolean, row: Message) => void) {
      doActionWithError<UpdateMessageRequest, UpdateMessageResponse>(
        API.UPDATE_MESSAGE,
        req,
        req.NotifyMessage,
        (resp: UpdateMessageResponse): void => {
          const index = this.Messages.Messages.findIndex((el) => el.ID === resp.Info.ID)
          this.Messages.Messages.splice(index < 0 ? 0 : index, index < 0 ? 0 : 1, resp.Info)
          done(false, resp.Info)
        }, () => {
          done(true, {} as Message)
        }
      )
    }
  }
})